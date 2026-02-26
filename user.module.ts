import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DatabaseModule } from '@/infra/database/database.module';
import { CustomerModule } from '../customer/customer.module';
import { DoctorModule } from '../doctor/doctor.module';
import { EmailModule } from '@/infra/email/email.module';
import { EnsureAuthMiddleware } from '../auth/middlewares/ensure-auth.middleware';
import { UserRepository } from '@/infra/database/prisma/repositories/user.repository';
import { UserGroupRepository } from '@/infra/database/prisma/repositories/user-group.repository';
import { DocumentRepository } from '@/infra/database/prisma/repositories/document.repository';
import { CreateUserController } from '@/api/user/controllers/create-user.controller';
import { FindUserController } from '@/api/user/controllers/find-user.controller';
import { FindUserProfileController } from '@/api/user/controllers/find-user-profile.controller';
import { ListUsersController } from '@/api/user/controllers/list-users.controller';
import { ListUserDocumentsController } from '@/api/user/controllers/list-user-documents.controller';
import { UpdateUserController } from '@/api/user/controllers/update-user.controller';
import { UpdateUserProfileController } from '@/api/user/controllers/update-user-profile.controller';
import { DeleteUserController } from '@/api/user/controllers/delete-user.controller';
import { EmailService } from '@/infra/email/email.service';
import { AmazonCloudFrontService } from '@/infra/integration/amazon/services/amazon-cloudfront.service';
import { CreateUserService } from './services/create-user.service';
import { FindUserService } from './services/find-user.service';
import { FindUserProfileService } from './services/find-user-profile.service';
import { ListUsersService } from './services/list-users.service';
import { ListUserDocumentsService } from './services/list-user-documents.service';
import { ListDocumentsService } from '../document/services/list-documents.service';
import { UpdateUserService } from './services/update-user.service';
import { UpdateUserProfileService } from './services/update-user-profile.service';
import { DeleteUserService } from './services/delete-user.service';

@Module({
  imports: [DatabaseModule, CustomerModule, DoctorModule, EmailModule],
  controllers: [
    CreateUserController,
    FindUserController,
    FindUserProfileController,
    ListUsersController,
    ListUserDocumentsController,
    UpdateUserController,
    UpdateUserProfileController,
    DeleteUserController,
  ],
  providers: [
    UserRepository,
    UserGroupRepository,
    DocumentRepository,
    EmailService,
    AmazonCloudFrontService,
    CreateUserService,
    FindUserService,
    FindUserProfileService,
    ListUsersService,
    ListUserDocumentsService,
    ListDocumentsService,
    UpdateUserService,
    UpdateUserProfileService,
    DeleteUserService,
  ],
  exports: [FindUserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(EnsureAuthMiddleware)
      .forRoutes(
        CreateUserController,
        FindUserController,
        FindUserProfileController,
        ListUsersController,
        ListUserDocumentsController,
        UpdateUserController,
        UpdateUserProfileController,
        DeleteUserController,
      );
  }
}
