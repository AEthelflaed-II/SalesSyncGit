import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { EnsureAuthMiddleware } from '../auth/middlewares/ensure-auth.middleware';
import { UserRepository } from '@/infra/database/prisma/repositories/user.repository';
import { UserGroupRepository } from '@/infra/database/prisma/repositories/user-group.repository';
import { CreateDoctorController } from '@/api/doctor/controllers/create-doctor.controller';
import { CreateDoctorService } from './services/create-doctor.service';

@Module({
  controllers: [CreateDoctorController],
  providers: [UserRepository, UserGroupRepository, CreateDoctorService],
})
export class DoctorModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(EnsureAuthMiddleware).forRoutes(CreateDoctorController);
  }
}
