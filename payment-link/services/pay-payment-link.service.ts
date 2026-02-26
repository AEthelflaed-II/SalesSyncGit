import { Injectable, Logger } from '@nestjs/common';
import { NotFoundError } from '@/common/errors/not-found.error';
import { PaymentLinkRepository } from '@/infra/database/prisma/repositories/payment-link.repository';
import { ConfigService } from '@/config/config.service';
import { SecurityService } from '@/infra/security/security.service';
import { BrazilPaysService } from '@/infra/integration/brazilpays/brazilpays.service';
import { CalculatePaymentService } from '@/app/payment/services/calculate-payment.service';
import { PayPaymentLinkDto } from '../dtos/pay-payment-link.dto';
import {
  ChargeType,
  LinkType,
  PaymentMethod,
} from '@/infra/integration/brazilpays/interfaces/brazilpays.interfaces';
import { CurrencyType } from '@/app/payment/interfaces/payment.interfaces';
import { getInvoice } from '@/app/order/helpers/invoice';
import { PaymentMethod as PaymentMethodType } from '@/app/payment/enums/payment.enum';
import { PaymentLinkStatus } from '../enums/payment-link.enum';

@Injectable()
export class PayPaymentLinkService {
  private readonly logger: Logger = new Logger(PayPaymentLinkService.name);
  constructor(
    private readonly config: ConfigService,
    private readonly security: SecurityService,
    private readonly brazilPays: BrazilPaysService,
    private readonly calculatePayment: CalculatePaymentService,
    private readonly paymentLinkRepository: PaymentLinkRepository,
  ) {}

  async execute({
    exchange: _,
    profile,
    installments,
    paymentMethod,
    paymentLinkId,
  }: PayPaymentLinkDto) {
    try {
      const paymentLink = await this.paymentLinkRepository.findOne(paymentLinkId, {
        secretKey: true,
      });

      if (!paymentLink) {
        throw new NotFoundError({
          module: 'PaymentLink',
          code: 'S.PPL.01',
          message: 'Link de pagamento não encontrado.',
        });
      }

      const currencyMap: Record<CurrencyType, LinkType> = {
        BRL: LinkType.BRL,
        USD: LinkType.USD,
      };

      const paymentMethodMap: Record<PaymentMethodType, PaymentMethod> = {
        [PaymentMethodType.PIX]: PaymentMethod.PIX,
        [PaymentMethodType.CREDIT_CARD]: PaymentMethod.CREDIT_CARD,
      };

      const signature = this.security.createHmac(paymentLink.id, {
        secretKey: paymentLink.secretKey,
        algorithm: 'sha256',
        encoding: 'base64',
      });

      try {
        const providerPayment = await this.brazilPays.chargeCreate({
          profile,
          installment: installments,
          exchange: paymentLink.exchangeQuote.exchangeRef,
          usedExchange: paymentLink.exchangeQuote.exchange,
          paymentMethod: paymentMethodMap[paymentMethod],
          invoice: getInvoice(paymentLink.order.invoice),
          linkType: currencyMap[paymentLink.currency],
          reference: paymentLink.order.id,
          typeCharge: ChargeType.LINK,
          description: `Pagamento da remessa de número ${getInvoice(paymentLink.order.invoice)}.`,
          urlWebHook: `${this.config.API_URL}/payments/${paymentLink.id}/wh/brazilpays?signature=${Buffer.from(signature).toString('base64')}`,
          feeIsForTheMerchant: paymentLink.feeForMerchant,
          ...(paymentLink.feeForMerchant && {
            installmentFeeIsForTheMerchant: paymentLink.installmentMerchant,
          }),
          valuesUsd: {
            netValue: this.getUsdValue(
              paymentLink.currency as CurrencyType,
              paymentLink.amount,
              paymentLink.exchangeQuote.exchange,
            ),
          },
        });

        const providerExchange = await this.calculatePayment.execute({
          currency: paymentLink.currency as CurrencyType,
          value: paymentLink.amount,
          feeForMerchant: paymentLink.feeForMerchant,
          installment: paymentLink.installmentMerchant,
        });

        await this.paymentLinkRepository.update(paymentLink.id, {
          exchangeAtPayment: providerExchange.exchange,
          installmentCustomer: +installments,
          paymentMethod,
          referenceId: providerPayment.id,
        });

        if (paymentMethod === PaymentMethodType.PIX) {
          return {
            id: providerPayment.id,
            status: PaymentLinkStatus.INITIATED,
            qrCode: providerPayment.qrCode,
            qrCodeImage: providerPayment.qrCodeImage,
            amount: providerPayment.valuesBrl.grossValue,
            amountNet: providerPayment.valuesBrl.netValue,
            platformFee: providerPayment.valuesBrl.platformValue,
            gatewayFee: providerPayment.valuesBrl.gatewayValue,
          };
        }

        return {
          id: providerPayment.id,
          status: PaymentLinkStatus.PROCESSING,
          amount: providerPayment.valuesBrl.grossValue,
          amountNet: providerPayment.valuesBrl.netValue,
          platformFee: providerPayment.valuesBrl.platformValue,
          gatewayFee: providerPayment.valuesBrl.gatewayValue,
        };
      } catch (error) {
        this.logger.error('Erro ao criar pagamento na BrazilPays', error);
        throw error;
      }
    } catch (error) {
      this.logger.error('Erro ao criar pagamento', error);
      throw error;
    }
  }

  getUsdValue(currency: CurrencyType, value: number, exchange: number) {
    return currency === CurrencyType.USD ? value : value / exchange;
  }
}
