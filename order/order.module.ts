import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DatabaseModule } from '@/infra/database/database.module';
import { EnsureAuthMiddleware } from '../auth/middlewares/ensure-auth.middleware';
import { OrderRepository } from '@/infra/database/prisma/repositories/order.repository';
import { UserRepository } from '@/infra/database/prisma/repositories/user.repository';
import { PaymentLinkRepository } from '@/infra/database/prisma/repositories/payment-link.repository';
import { StockProductRepository } from '@/infra/database/prisma/repositories/stock-product.repository';
import { CreateOrderController } from '@/api/order/controllers/create-order.controller';
import { FindOrderController } from '@/api/order/controllers/find-order.controller';
import { ListOrdersController } from '@/api/order/controllers/list-orders.controller';
import { UpdateOrderController } from '@/api/order/controllers/update-order.controller';
import { UpdateOrderStatusController } from '@/api/order/controllers/update-order-status.controller';
import { BrazilPaysService } from '@/infra/integration/brazilpays/brazilpays.service';
import { PaymentLinkService } from '../payment-link/payment-link.service';
import { AmazonCloudFrontService } from '@/infra/integration/amazon/services/amazon-cloudfront.service';
import { CreateOrderService } from './services/create-order.service';
import { FindOrderService } from './services/find-order.service';
import { ListOrdersService } from './services/list-orders.service';
import { UpdateOrderService } from './services/update-order.service';
import { UpdateOrderStatusService } from './services/update-order-status.service';
import { CreatePaymentLinkService } from '../payment-link/services/create-payment-link.service';

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateOrderController,
    FindOrderController,
    ListOrdersController,
    UpdateOrderController,
    UpdateOrderStatusController,
  ],
  providers: [
    OrderRepository,
    UserRepository,
    PaymentLinkRepository,
    StockProductRepository,
    BrazilPaysService,
    PaymentLinkService,
    AmazonCloudFrontService,
    CreateOrderService,
    FindOrderService,
    ListOrdersService,
    UpdateOrderService,
    UpdateOrderStatusService,
    CreatePaymentLinkService,
  ],
})
export class OrderModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(EnsureAuthMiddleware)
      .forRoutes(
        CreateOrderController,
        FindOrderController,
        UpdateOrderController,
        UpdateOrderStatusController,
        ListOrdersController,
      );
  }
}
