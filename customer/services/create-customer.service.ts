import { Injectable } from '@nestjs/common';
import { NotFoundError } from '@/common/errors/not-found.error';
import { UserRepository } from '@/infra/database/prisma/repositories/user.repository';
import { CreateSimplifiedUserService } from '@/app/user/services/create-simplified-user.service';
import { CreateUserDto } from '@/app/user/dtos/create-user.dto';
import { UserType } from '@/app/user/enums/user.enum';

@Injectable()
export class CreateCustomerService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly createUser: CreateSimplifiedUserService,
  ) {}

  async execute(data: CreateUserDto) {
    const representative = await this.userRepository.findOne(data.representativeId);
    if (!representative) {
      throw new NotFoundError({
        module: 'User',
        code: 'S.CCS.1',
        message: 'Representante não encontrado.',
      });
    }

    return this.createUser.execute(UserType.CUSTOMER, data);
  }
}
