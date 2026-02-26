import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BrazilPaysModule } from '@/infra/integration/brazilpays/brazilpays.module';
import { EmailModule } from '@/infra/email/email.module';
import { OrderRepository } from '@/infra/database/prisma/repositories/order.repository';
import { PaymentRepository } from '@/infra/database/prisma/repositories/payment.repository';
import { PaymentLinkRepository } from '@/infra/database/prisma/repositories/payment-link.repository';
import { StockProductRepository } from '@/infra/database/prisma/repositories/stock-product.repository';
import { PaymentWebhooksController } from '@/api/payment/controllers/payment-webhooks.controller';
import { CalculatePaymentController } from '@/api/payment/controllers/calculate-payment.controller';
import { EmailService } from '@/infra/email/email.service';
import { PaymentService } from './payment.service';
import { PaymentLinkService } from '../payment-link/payment-link.service';
import { BrazilPaysService } from '@/infra/integration/brazilpays/brazilpays.service';
import { CreatePaymentService } from './services/create-payment.service';
import { CalculatePaymentService } from './services/calculate-payment.service';
import { UpdatePaymentStatusService } from './services/update-payment-status.service';
import { EnsureAuthMiddleware } from '../auth/middlewares/ensure-auth.middleware';
import { FindOrderService } from '../order/services/find-order.service';
import { FindPaymentService } from './services/find-payment.service';
import { FindPaymentLinkService } from '../payment-link/services/find-payment-link.service';
import { UpdatePaymentLinkService } from '../payment-link/services/update-payment-link.service';
import { UpdateOrderService } from '../order/services/update-order.service';
import { UpdatePaymentService } from './services/update-payment.service';
import { AmazonCloudFrontService } from '@/infra/integration/amazon/services/amazon-cloudfront.service';

@Module({
  imports: [BrazilPaysModule, EmailModule],
  controllers: [PaymentWebhooksController, CalculatePaymentController],
  providers: [
    OrderRepository,
    PaymentRepository,
    PaymentLinkRepository,
    StockProductRepository,
    EmailService,
    PaymentService,
    PaymentLinkService,
    BrazilPaysService,
    CreatePaymentService,
    CalculatePaymentService,
    FindOrderService,
    FindPaymentService,
    FindPaymentLinkService,
    UpdateOrderService,
    UpdatePaymentService,
    UpdatePaymentLinkService,
    UpdatePaymentStatusService,
    AmazonCloudFrontService,
  ],
})
export class PaymentModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(EnsureAuthMiddleware).forRoutes(CalculatePaymentController);
  }
}
