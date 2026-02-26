import { Injectable } from '@nestjs/common';
import { NotFoundError } from '@/common/errors/not-found.error';
import { OrderRepository } from '@/infra/database/prisma/repositories/order.repository';
import { PaymentLinkService } from '@/app/payment-link/payment-link.service';
import { AmazonCloudFrontService } from '@/infra/integration/amazon/services/amazon-cloudfront.service';

@Injectable()
export class FindOrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly paymentLinkService: PaymentLinkService,
    private readonly amazonCloudFront: AmazonCloudFrontService,
  ) {}

  async execute(id: string) {
    const order = await this.orderRepository.findOne(id, {
      documents: true,
      links: true,
    });

    if (!order) {
      throw new NotFoundError({
        module: 'Order',
        code: 'S.FOS.01',
        message: 'Pedido não encontrado.',
      });
    }

    return {
      ...order,
      documents: order.documents.map((document) => ({
        id: document.id,
        type: document.type,
        number: document.number,
        key: document.key,
        url: this.amazonCloudFront.getSignedUrl(document.key),
        ...document,
      })),
      links: order.links.map((link) => ({
        ...link,
        paymentUrl: this.paymentLinkService.getPaymentLinkUrl(link.id),
      })),
    };
  }
}
