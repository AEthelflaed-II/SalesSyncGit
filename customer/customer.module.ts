import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { EnsureAuthMiddleware } from '../auth/middlewares/ensure-auth.middleware';
import { UserRepository } from '@/infra/database/prisma/repositories/user.repository';
import { UserGroupRepository } from '@/infra/database/prisma/repositories/user-group.repository';
import { CreateCustomerController } from '@/api/customer/controllers/create-customer.controller';
import { FindCustomerController } from '@/api/customer/controllers/find-customer.controller';
import { EntityMessagesService } from '../template/messages/entity-messages.service';
import { CreateSimplifiedUserService } from '../user/services/create-simplified-user.service';
import { CreateCustomerService } from './services/create-customer.service';
import { FindUserService } from '../user/services/find-user.service';

@Module({
  controllers: [CreateCustomerController, FindCustomerController],
  providers: [
    UserRepository,
    UserGroupRepository,
    EntityMessagesService,
    CreateSimplifiedUserService,
    CreateCustomerService,
    FindUserService,
  ],
})
export class CustomerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(EnsureAuthMiddleware)
      .forRoutes(CreateCustomerController, FindCustomerController);
  }
}
