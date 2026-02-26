import { Injectable, Logger } from '@nestjs/common';
import { OrderRepository } from '@/infra/database/prisma/repositories/order.repository';
import { PaymentLinkRepository } from '@/infra/database/prisma/repositories/payment-link.repository';
import { StockProductRepository } from '@/infra/database/prisma/repositories/stock-product.repository';
import { Cron } from '@nestjs/schedule';
import { PaymentLinkStatus } from '@/app/payment-link/enums/payment-link.enum';

@Injectable()
export class PaymentLinksExpiredSchedule {
  private readonly logger: Logger = new Logger('PaymentSchedule');
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly paymentLinkRepository: PaymentLinkRepository,
    private readonly stockProductRepository: StockProductRepository,
  ) {}

  @Cron('0 3 * * *', {
    timeZone: 'America/Sao_Paulo',
  })
  async updateExpiredLinks() {
    const links = await this.paymentLinkRepository.listExpiredLinks();
    if (!links.length) {
      return;
    }

    this.logger.log(
      `Found ${links.length} expired payment links`,
      'Rolling back stock products and updating payment link status...',
    );

    await Promise.all(
      links.map(async (link) => {
        await this.paymentLinkRepository.updateStatus(link.id, PaymentLinkStatus.EXPIRED);
        this.logger.log(`Link ${link.id} status updated`);

        const products = await this.orderRepository.listProducts(link.orderId);
        if (!products.length) {
          return;
        }

        await Promise.all(
          products.map(async (product) => {
            await this.stockProductRepository.increaseInStock(
              product.stockProductId,
              product.quantity,
            );
          }),
        );

        this.logger.log(
          `Stock products for order ${link.orderId} rolled back successfully`,
        );
      }),
    );
  }
}
