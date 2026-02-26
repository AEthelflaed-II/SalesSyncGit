import { HttpStatus, Injectable } from '@nestjs/common';
import { ApplicationError } from '@/common/errors/application.error';
import { NotFoundError } from '@/common/errors/not-found.error';
import { UserRepository } from '@/infra/database/prisma/repositories/user.repository';
import { MedicalSpecialtyRepository } from '@/infra/database/prisma/repositories/medical-specialty.repository';
import { CreateMedicalSpecialtyDto } from '../dtos/create-medical-specialty.dto';
import { UserType } from '@/app/user/enums/user.enum';

@Injectable()
export class CreateMedicalSpecialtyService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly medicalSpecialtyRepository: MedicalSpecialtyRepository,
  ) {}

  async execute(data: CreateMedicalSpecialtyDto) {
    if (data.doctorId) {
      const doctor = await this.userRepository.findOne(data.doctorId);
      if (!doctor) {
        throw new NotFoundError({
          module: 'Medical Specialty',
          code: 'S.CMSS.1',
          message: 'Médico não encontrado.',
        });
      } else if (doctor.group.type !== UserType.DOCTOR) {
        throw new ApplicationError({
          module: 'Medical Specialty',
          code: 'S.CMSS.2',
          message: 'Usuário não é um médico.',
          status: HttpStatus.BAD_REQUEST,
        });
      }
    }

    return this.medicalSpecialtyRepository.create(data);
  }
}
