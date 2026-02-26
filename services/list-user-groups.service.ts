import { Injectable } from '@nestjs/common';
import { UserGroupRepository } from '@/infra/database/prisma/repositories/user-group.repository';
import { ListUserGroupsDto } from '../dtos/list-user-groups.dto';

@Injectable()
export class ListUserGroupsService {
  constructor(private readonly userGroupRepository: UserGroupRepository) {}

  async execute(options: ListUserGroupsDto) {
    return this.userGroupRepository.list(options);
  }
}
