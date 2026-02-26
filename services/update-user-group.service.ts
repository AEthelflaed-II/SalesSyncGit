import { Injectable } from '@nestjs/common';
import { NotFoundError } from '@/common/errors/not-found.error';
import { UserGroupRepository } from '@/infra/database/prisma/repositories/user-group.repository';
import { ResourceBaseParams } from '@/infra/base/interfaces/request-params.interfaces';
import { UpdateUserGroupDto } from '../dtos/update-user-group.dto';

@Injectable()
export class UpdateUserGroupService {
  constructor(private readonly userGroupRepository: UserGroupRepository) {}

  async execute({ id }: ResourceBaseParams, data: UpdateUserGroupDto) {
    const userGroup = await this.userGroupRepository.findOne(id);
    if (!userGroup) {
      throw new NotFoundError({
        module: 'UserGroup',
        code: 'S.UGU.0001',
        message: 'Grupo de usuários não encontrado.',
      });
    }

    await this.userGroupRepository.update(id, data);
  }
}
