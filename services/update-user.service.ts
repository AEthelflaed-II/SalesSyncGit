import { Injectable } from '@nestjs/common';
import { NotFoundError } from '@/common/errors/not-found.error';
import { UserRepository } from '@/infra/database/prisma/repositories/user.repository';
import { ResourceBaseParams } from '@/infra/base/interfaces/request-params.interfaces';
import { UpdateUserDto } from '../dtos/update-user.dto';

@Injectable()
export class UpdateUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ id }: ResourceBaseParams, data: UpdateUserDto) {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundError({
        module: 'User',
        code: 'S.UU.0001',
        message: 'Usuário não encontrado.',
      });
    }

    await this.userRepository.update(id, data);
  }
}
