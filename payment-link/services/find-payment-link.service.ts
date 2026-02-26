import { HttpStatus, Injectable } from '@nestjs/common';
import { ApplicationError } from '@/common/errors/application.error';
import { NotFoundError } from '@/common/errors/not-found.error';
import { OrderRepository } from '@/infra/database/prisma/repositories/order.repository';
import { StockProductRepository } from '@/infra/database/prisma/repositories/stock-product.repository';
import { PaymentLinkRepository } from '@/infra/database/prisma/repositories/payment-link.repository';
import { BrazilPaysService } from '@/infra/integration/brazilpays/brazilpays.service';
import { PaymentLinkStatus } from '../enums/payment-link.enum';
import { PaymentMethod } from '@/app/payment/enums/payment.enum';

@Injectable()
export class FindPaymentLinkService {
  constructor(
    private readonly brazilPays: BrazilPaysService,
    private readonly orderRepository: OrderRepository,
    private readonly stockProductRepository: StockProductRepository,
    private readonly paymentLinkRepository: PaymentLinkRepository,
  ) {}
  async execute(id: string, { secretKey = false } = {}) {
    const paymentLink = await this.paymentLinkRepository.findOne(id, { secretKey });
    if (!paymentLink) {
      throw new NotFoundError({
        module: 'PaymentLink',
        code: 'S.FPL.01',
        message: 'Link de pagamento não encontrado.',
      });
    } else if (paymentLink.status === PaymentLinkStatus.EXPIRED) {
      throw new ApplicationError({
        module: 'PaymentLink',
        code: 'S.FPL.02',
        message: 'Link de pagamento expirado.',
        status: HttpStatus.GONE,
      });
    } else if (paymentLink.status === PaymentLinkStatus.CANCELED) {
      throw new ApplicationError({
        module: 'PaymentLink',
        code: 'S.FPL.03',
        message: 'Link de pagamento cancelado.',
        status: HttpStatus.GONE,
      });
    }

    if (paymentLink.expiresAt && paymentLink.expiresAt < new Date()) {
      await this.paymentLinkRepository.updateStatus(id, PaymentLinkStatus.EXPIRED);
      paymentLink.status = PaymentLinkStatus.EXPIRED;

      const products = await this.orderRepository.listProducts(paymentLink.order.id);
      await Promise.all(
        products.map(async (product) => {
          await this.stockProductRepository.increaseInStock(
            product.stockProductId,
            product.quantity,
          );
        }),
      );
    }

    if (paymentLink.status === PaymentLinkStatus.CREATED) {
      await this.paymentLinkRepository.updateStatus(id, PaymentLinkStatus.ACTIVE);
      paymentLink.status = PaymentLinkStatus.ACTIVE;
    }

    if (
      paymentLink.paymentMethod === PaymentMethod.PIX &&
      paymentLink.status === PaymentLinkStatus.PENDING
    ) {
      const charge = await this.brazilPays.findCharge(paymentLink.referenceId);
      if (!charge) {
        return paymentLink;
      }

      return {
        ...paymentLink,
        platform: charge,
      };
    }

    return paymentLink;
  }
}
