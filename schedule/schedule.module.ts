import { Global, Module } from '@nestjs/common';
import { ScheduleModule as NestSchedule } from '@nestjs/schedule';
import { PaymentLinksExpiredSchedule } from './services/payment-links-expired.schedule';
import { OrderRepository } from '../database/prisma/repositories/order.repository';
import { PaymentLinkRepository } from '../database/prisma/repositories/payment-link.repository';
import { StockProductRepository } from '../database/prisma/repositories/stock-product.repository';

@Global()
@Module({
  imports: [NestSchedule.forRoot()],
  providers: [
    OrderRepository,
    PaymentLinkRepository,
    StockProductRepository,
    PaymentLinksExpiredSchedule,
  ],
  exports: [NestSchedule],
})
export class ScheduleModule {}
