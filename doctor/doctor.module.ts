import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { EnsureAuthMiddleware } from '../auth/middlewares/ensure-auth.middleware';
import { UserRepository } from '@/infra/database/prisma/repositories/user.repository';
import { UserGroupRepository } from '@/infra/database/prisma/repositories/user-group.repository';
import { CreateDoctorController } from '@/api/doctor/controllers/create-doctor.controller';
import { FindDoctorController } from '@/api/doctor/controllers/find-doctor.controller';
import { EntityMessagesService } from '../template/messages/entity-messages.service';
import { CreateDoctorService } from './services/create-doctor.service';
import { CreateSimplifiedUserService } from '../user/services/create-simplified-user.service';
import { FindUserService } from '../user/services/find-user.service';

@Module({
  controllers: [CreateDoctorController, FindDoctorController],
  providers: [
    UserRepository,
    UserGroupRepository,
    EntityMessagesService,
    CreateSimplifiedUserService,
    CreateDoctorService,
    FindUserService,
  ],
})
export class DoctorModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(EnsureAuthMiddleware)
      .forRoutes(CreateDoctorController, FindDoctorController);
  }
}
