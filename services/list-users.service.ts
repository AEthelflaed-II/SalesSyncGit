import { Injectable } from '@nestjs/common';
import { UserRepository } from '@/infra/database/prisma/repositories/user.repository';
import { ListUsersDto } from '../dtos/list-users.dto';

@Injectable()
export class ListUsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(options: ListUsersDto) {
    return this.userRepository.list(options);
  }
}
