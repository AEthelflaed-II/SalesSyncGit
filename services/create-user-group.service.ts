import { Injectable } from '@nestjs/common';
import { UserGroupRepository } from '@/infra/database/prisma/repositories/user-group.repository';
import { CreateUserGroupDto } from '../dtos/create-user-group.dto';

@Injectable()
export class CreateUserGroupService {
  constructor(private readonly userGroupRepository: UserGroupRepository) {}

  async execute(data: CreateUserGroupDto) {
    return this.userGroupRepository.create(data);
  }
}
