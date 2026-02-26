import { Injectable } from '@nestjs/common';
import { NotFoundError } from '@/common/errors/not-found.error';
import { UserRepository } from '@/infra/database/prisma/repositories/user.repository';
import { ResourceBaseParams } from '@/infra/base/interfaces/request-params.interfaces';
import { UpdateUserProfileDto } from '../dtos/update-user.dto';

@Injectable()
export class UpdateUserProfileService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ id }: ResourceBaseParams, data: UpdateUserProfileDto) {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundError({
        module: 'User',
        code: 'S.UUP.0001',
        message: 'Usuário não encontrado.',
      });
    }

    await this.userRepository.updateProfile(user.profile.id, data);
  }
}
