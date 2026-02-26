import { Injectable } from '@nestjs/common';
import { CreateSimplifiedUserService } from '@/app/user/services/create-simplified-user.service';
import { CreateUserDto } from '@/app/user/dtos/create-user.dto';
import { UserType } from '@/app/user/enums/user.enum';

@Injectable()
export class CreateDoctorService {
  constructor(private readonly createUser: CreateSimplifiedUserService) {}

  async execute(data: CreateUserDto) {
    return this.createUser.execute(UserType.DOCTOR, data);
  }
}
