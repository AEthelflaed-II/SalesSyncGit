import { Injectable } from '@nestjs/common';
import { NotFoundError } from '@/common/errors/not-found.error';
import { UserGroupRepository } from '@/infra/database/prisma/repositories/user-group.repository';
import { ResourceBaseParams } from '@/infra/base/interfaces/request-params.interfaces';

@Injectable()
export class FindUserGroupService {
  constructor(private readonly userGroupRepository: UserGroupRepository) {}

  async execute({ id }: ResourceBaseParams) {
    const userGroup = await this.userGroupRepository.findOne(id);
    if (!userGroup) {
      throw new NotFoundError({
        module: 'UserGroup',
        code: 'S.UGF.0001',
        message: 'Grupo de usuários não encontrado.',
      });
    }

    return userGroup;
  }
}
