import { Injectable, Logger } from '@nestjs/common';
import { ApplicationError } from '@/common/errors/application.error';
import { UnauthorizedError } from '@/common/errors/unauthorized.error';
import { StockProductRepository } from '@/infra/database/prisma/repositories/stock-product.repository';
import { ConfigService } from '@/config/config.service';
import { EmailService } from '@/infra/email/email.service';
import { SecurityService } from '@/infra/security/security.service';
import { FindOrderService } from '../order/services/find-order.service';
import { UpdateOrderService } from '../order/services/update-order.service';
import { CreatePaymentService } from './services/create-payment.service';
import { FindPaymentLinkService } from '../payment-link/services/find-payment-link.service';
import { UpdatePaymentLinkService } from '../payment-link/services/update-payment-link.service';
import { UpdatePaymentService } from './services/update-payment.service';
import { BrazilPaysWebhookRequestDto } from '@/infra/integration/brazilpays/dtos/brazilpays-webhook.dto';
import { PaymentProvider } from './interfaces/payment.interfaces';
import { OrderStatus } from '../order/enums/order.enum';
import { PaymentStatus } from './enums/payment.enum';
import { PaymentLinkStatus } from '../payment-link/enums/payment-link.enum';
import { getInvoice } from '../order/helpers/invoice';

@Injectable()
export class PaymentService {
  private readonly logger: Logger = new Logger(PaymentService.name);
  private readonly status: Array<
    [PaymentStatus, PaymentLinkStatus, OrderStatus, string, boolean]
  > = [
    [PaymentStatus.PENDING, PaymentLinkStatus.PENDING, , 'Pendente', false],
    [PaymentStatus.PAID, PaymentLinkStatus.PAID, OrderStatus.PAID, 'Pago', true],
    [PaymentStatus.REFUSED, PaymentLinkStatus.FAILED, , 'Recusado', true],
    [PaymentStatus.EXPIRED, PaymentLinkStatus.EXPIRED, , 'Vencido', true],
    [PaymentStatus.CANCELED, PaymentLinkStatus.CANCELED, , 'Cancelado', true],
    [PaymentStatus.RELEASED, , , 'Repassado para o merchant', false],
    [PaymentStatus.REVERSED, PaymentLinkStatus.FAILED, , 'Estornado', true],
  ];
  constructor(
    private readonly config: ConfigService,
    private readonly security: SecurityService,
    private readonly emailService: EmailService,
    private readonly createPayment: CreatePaymentService,
    private readonly findOrder: FindOrderService,
    private readonly findPaymentLink: FindPaymentLinkService,
    private readonly updatePayment: UpdatePaymentService,
    private readonly updateOrder: UpdateOrderService,
    private readonly updatePaymentLink: UpdatePaymentLinkService,
    private readonly stockProductRepository: StockProductRepository,
  ) {}

  async brazilPaysWebhook(
    paymentLinkId: string,
    signature: string,
    data: BrazilPaysWebhookRequestDto,
  ) {
    try {
      const decodedSignature = Buffer.from(signature, 'base64').toString('utf-8');
      const [paymentStatus, paymentLinkStatus, orderStatus, statusName, sendEmail] =
        this.status[data.paymentStatus];

      this.logger.log(
        `[WEBHOOK] BrazilPays ● Recebido atualização de status do pagamento [${paymentLinkId}].`,
        `[WEBHOOK] BrazilPays ● Remessa: ${data.reference}.`,
        `[WEBHOOK] BrazilPays ● Status: ${statusName}.`,
      );

      const paymentLink = await this.findPaymentLink.execute(paymentLinkId, {
        secretKey: true,
      });

      if (!paymentLink) {
        this.logger.error('[WEBHOOK] BrazilPays ● Link de pagamento não encontrado.');
        throw new UnauthorizedError({
          module: 'Payment',
          code: 'S.PAY-BP.0001',
          message: 'Não autorizado.',
        });
      }

      if (data.reference !== paymentLink.order.id) {
        this.logger.error(
          `[WEBHOOK] BrazilPays ● Remessa recebida [${data.reference}] não corresponde a remessa [${paymentLink.order.id}].`,
        );

        throw new UnauthorizedError({
          module: 'Payment',
          code: 'S.PAY-BP.0002',
          message: 'Não autorizado.',
        });
      }

      const order = await this.findOrder.execute(paymentLink.order.id);
      if (!order) {
        this.logger.error('[WEBHOOK] BrazilPays ● Remessa não encontrada.');
        throw new UnauthorizedError({
          module: 'Payment',
          code: 'S.PAY-BP.0003',
          message: 'Não autorizado.',
        });
      }

      const expectedSignature = this.security.createHmac(paymentLinkId, {
        secretKey: paymentLink.secretKey,
        algorithm: 'sha256',
        encoding: 'base64',
      });

      if (decodedSignature !== expectedSignature) {
        this.logger.error(
          `Assinatura inválida. Esperada: ${expectedSignature}, recebida: ${decodedSignature}.`,
        );

        throw new UnauthorizedError({
          module: 'Payment',
          code: 'S.PAY-BP.0004',
          message: 'Não autorizado.',
        });
      }

      await this.updatePaymentLink.execute(paymentLinkId, {
        status: paymentLinkStatus,
      });

      if (!paymentLink.order.payments.length) {
        await this.createPayment.execute({
          provider: PaymentProvider.BRAZILPAYS,
          status: paymentStatus,
          currency: paymentLink.currency,
          amount: paymentLink.amount,
          orderId: paymentLink.order.id,
        });

        this.logger.log(
          `[WEBHOOK] BrazilPays ● Criado pagamento [${paymentLinkId}] para o pedido [${paymentLink.order.id}].`,
        );
      } else if (paymentLink.order.payments[0].status !== paymentStatus) {
        await this.updatePayment.execute(paymentLink.order.payments[0].id, {
          status: paymentStatus,
          ...(paymentStatus === PaymentStatus.PAID && {
            paymentDate: new Date(),
            paymentId: data.transactionUuid,
          }),
        });
      }

      if (order.status !== orderStatus && orderStatus === OrderStatus.PAID) {
        await this.updateOrder.execute(order.id, {
          status: orderStatus,
        });
      }

      if ([PaymentStatus.CANCELED, PaymentStatus.REVERSED].includes(paymentStatus)) {
        await Promise.all(
          order.products.map(async (product) => {
            await this.stockProductRepository.increaseInStock(
              product.stockProduct.id,
              product.quantity,
            );
          }),
        );
      }

      this.logger.log(
        `[WEBHOOK] BrazilPays ● Status do pagamento [${paymentLinkId}] atualizado para ${statusName}.`,
      );

      const { profile } = paymentLink.order.customer.user;

      if (!sendEmail) {
        return;
      }

      try {
        await this.emailService.sendEmail({
          from: `Entourage Phytolab <${this.config.BACKOFFICE_PAYMENT_EMAIL_FROM}>`,
          to: [
            this.config.BACKOFFICE_PAYMENT_EMAIL_TO,
            ...(profile.email ? [profile.email] : []),
          ],
          subject: 'Status do pagamento atualizado',
          template: `payments/${paymentStatus}`,
          data: {
            status,
            name: profile.firstName,
            invoice: getInvoice(paymentLink.order.invoice),
            whatsAppNumber: this.config.BACKOFFICE_SUPPORT_WHATSAPP_NUMBER,
            cdnUrl: this.config.AWS_CLOUDFRONT_URL,
          },
        });
      } catch (error) {
        if (error instanceof ApplicationError) {
          this.logger.error(
            '[WEBHOOK] BrazilPays ● Erro ao enviar email de notificação.',
            error,
          );
        }
      }
    } catch (error) {
      this.logger.error(
        '[WEBHOOK] BrazilPays ● Erro ao processar status do pagamento.',
        error,
      );

      if (error instanceof ApplicationError) {
        throw error;
      }

      throw new ApplicationError({
        module: 'Payment',
        code: 'S.PAY-BP.0005',
        message: 'Erro ao processar status do pagamento.',
        errors: [error],
      });
    }
  }
}
