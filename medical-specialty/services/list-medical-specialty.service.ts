import { Injectable } from '@nestjs/common';
import { MedicalSpecialtyRepository } from '@/infra/database/prisma/repositories/medical-specialty.repository';
import { ListMedicalSpecialtiesDto } from '../dtos/list-medical-specialties.dto';

@Injectable()
export class ListMedicalSpecialtiesService {
  constructor(
    private readonly medicalSpecialtyRepository: MedicalSpecialtyRepository,
  ) {}

  async execute(options: ListMedicalSpecialtiesDto) {
    return this.medicalSpecialtyRepository.list(options);
  }
}
