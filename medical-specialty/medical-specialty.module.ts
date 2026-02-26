import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { EnsureAuthMiddleware } from '../auth/middlewares/ensure-auth.middleware';
import { UserRepository } from '@/infra/database/prisma/repositories/user.repository';
import { MedicalSpecialtyRepository } from '@/infra/database/prisma/repositories/medical-specialty.repository';
import { CreateMedicalSpecialtyController } from '@/api/medical-specialty/controllers/create-medical-specialty.controller';
import { FindMedicalSpecialtyController } from '@/api/medical-specialty/controllers/find-medical-specialty.controller';
import { ListMedicalSpecialtiesController } from '@/api/medical-specialty/controllers/list-medical-specialty.controller';
import { UpdateMedicalSpecialtyController } from '@/api/medical-specialty/controllers/update-medical-specialty.controller';
import { DeleteMedicalSpecialtyController } from '@/api/medical-specialty/controllers/delete-medical-specialty.controller';
import { CreateMedicalSpecialtyService } from './services/create-medical-specialty.service';
import { FindMedicalSpecialtyService } from './services/find-medical-specialty.service';
import { ListMedicalSpecialtiesService } from './services/list-medical-specialty.service';
import { UpdateMedicalSpecialtyService } from './services/update-medical-specialty.service';
import { DeleteMedicalSpecialtyService } from './services/delete-medical-specialty.service';

@Module({
  controllers: [
    CreateMedicalSpecialtyController,
    FindMedicalSpecialtyController,
    ListMedicalSpecialtiesController,
    UpdateMedicalSpecialtyController,
    DeleteMedicalSpecialtyController,
  ],
  providers: [
    UserRepository,
    MedicalSpecialtyRepository,
    CreateMedicalSpecialtyService,
    FindMedicalSpecialtyService,
    ListMedicalSpecialtiesService,
    UpdateMedicalSpecialtyService,
    DeleteMedicalSpecialtyService,
  ],
})
export class MedicalSpecialtyModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(EnsureAuthMiddleware)
      .forRoutes(
        CreateMedicalSpecialtyController,
        FindMedicalSpecialtyController,
        ListMedicalSpecialtiesController,
        UpdateMedicalSpecialtyController,
        DeleteMedicalSpecialtyController,
      );
  }
}
