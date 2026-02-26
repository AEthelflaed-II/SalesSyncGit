import { Injectable } from '@nestjs/common';
import { NotFoundError } from '@/common/errors/not-found.error';
import { UserRepository } from '@/infra/database/prisma/repositories/user.repository';
import { ResourceBaseParams } from '@/infra/base/interfaces/request-params.interfaces';

@Injectable()
export class FindUserProfileService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ id }: ResourceBaseParams) {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundError({
        module: 'User',
        code: 'S.UPF.0001',
        message: 'Usuário não encontrado.',
      });
    }

    return user.profile;
  }
}
