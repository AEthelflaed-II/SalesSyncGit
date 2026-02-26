import { Injectable } from '@nestjs/common';
import { NotFoundError } from '@/common/errors/not-found.error';
import { MedicalSpecialtyRepository } from '@/infra/database/prisma/repositories/medical-specialty.repository';
import { UpdateMedicalSpecialtyDto } from '../dtos/update-medical-specialty.dto';

@Injectable()
export class UpdateMedicalSpecialtyService {
  constructor(
    private readonly medicalSpecialtyRepository: MedicalSpecialtyRepository,
  ) {}

  async execute(id: string, data: UpdateMedicalSpecialtyDto) {
    const medicalSpecialty = await this.medicalSpecialtyRepository.findOne(id);
    if (!medicalSpecialty) {
      throw new NotFoundError({
        module: 'Medical Specialty',
        code: 'S.UMSS.1',
        message: 'Especialidade médica não encontrada.',
      });
    }

    return this.medicalSpecialtyRepository.update(id, data);
  }
}
