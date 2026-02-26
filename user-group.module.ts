import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DatabaseModule } from '@/infra/database/database.module';
import { EnsureAuthMiddleware } from '../auth/middlewares/ensure-auth.middleware';
import { UserGroupRepository } from '@/infra/database/prisma/repositories/user-group.repository';
import { CreateUserGroupController } from '@/api/user-group/controllers/create-user-group.controller';
import { FindUserGroupController } from '@/api/user-group/controllers/find-user-group.controller';
import { ListUserGroupsController } from '@/api/user-group/controllers/list-user-groups.controller';
import { UpdateUserGroupController } from '@/api/user-group/controllers/update-user-group.controller';
import { DeleteUserGroupController } from '@/api/user-group/controllers/delete-user-group.controller';
import { CreateUserGroupService } from './services/create-user-group.service';
import { FindUserGroupService } from './services/find-user-group.service';
import { ListUserGroupsService } from './services/list-user-groups.service';
import { UpdateUserGroupService } from './services/update-user-group.service';
import { DeleteUserGroupService } from './services/delete-user-group.service';

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateUserGroupController,
    FindUserGroupController,
    ListUserGroupsController,
    UpdateUserGroupController,
    DeleteUserGroupController,
  ],
  providers: [
    UserGroupRepository,
    CreateUserGroupService,
    FindUserGroupService,
    ListUserGroupsService,
    UpdateUserGroupService,
    DeleteUserGroupService,
  ],
})
export class UserGroupModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(EnsureAuthMiddleware)
      .forRoutes(
        CreateUserGroupController,
        FindUserGroupController,
        ListUserGroupsController,
        UpdateUserGroupController,
        DeleteUserGroupController,
      );
  }
}
