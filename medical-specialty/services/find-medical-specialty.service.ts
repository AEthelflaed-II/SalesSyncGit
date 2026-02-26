import { Injectable } from '@nestjs/common';
import { NotFoundError } from '@/common/errors/not-found.error';
import { MedicalSpecialtyRepository } from '@/infra/database/prisma/repositories/medical-specialty.repository';

@Injectable()
export class FindMedicalSpecialtyService {
  constructor(
    private readonly medicalSpecialtyRepository: MedicalSpecialtyRepository,
  ) {}

  async execute(id: string) {
    const medicalSpecialty = await this.medicalSpecialtyRepository.findOne(id);
    if (!medicalSpecialty) {
      throw new NotFoundError({
        module: 'Medical Specialty',
        code: 'S.FMSS.1',
        message: 'Especialidade médica não encontrada.',
      });
    }

    return this.medicalSpecialtyRepository.findOne(id);
  }
}
