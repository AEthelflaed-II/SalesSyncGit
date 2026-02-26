import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { OrderRepository } from '@/infra/database/prisma/repositories/order.repository';
import { StockProductRepository } from '@/infra/database/prisma/repositories/stock-product.repository';
import { PaymentLinkRepository } from '@/infra/database/prisma/repositories/payment-link.repository';
import { CreatePaymentLinkController } from '@/api/payment-link/controllers/create-payment-link.controller';
import { ListPaymentLinksController } from '@/api/payment-link/controllers/list-payment-links.controller';
import { FindPaymentLinkController } from '@/api/payment-link/controllers/find-payment-link.controller';
import { PayPaymentLinkController } from '@/api/payment-link/controllers/pay-payment-link.controller';
import { PaymentLinkService } from './payment-link.service';
import { BrazilPaysService } from '@/infra/integration/brazilpays/brazilpays.service';
import { CalculatePaymentService } from '../payment/services/calculate-payment.service';
import { CreatePaymentLinkService } from './services/create-payment-link.service';
import { ListPaymentLinksService } from './services/list-payment-links.service';
import { FindPaymentLinkService } from './services/find-payment-link.service';
import { PayPaymentLinkService } from './services/pay-payment-link.service';
import { EnsureAuthMiddleware } from '../auth/middlewares/ensure-auth.middleware';

@Module({
  imports: [],
  controllers: [
    CreatePaymentLinkController,
    ListPaymentLinksController,
    FindPaymentLinkController,
    PayPaymentLinkController,
  ],
  providers: [
    OrderRepository,
    StockProductRepository,
    PaymentLinkRepository,
    CalculatePaymentService,
    PaymentLinkService,
    BrazilPaysService,
    CreatePaymentLinkService,
    ListPaymentLinksService,
    FindPaymentLinkService,
    PayPaymentLinkService,
  ],
})
export class PaymentLinkModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(EnsureAuthMiddleware)
      .forRoutes(CreatePaymentLinkController, ListPaymentLinksController);
  }
}
