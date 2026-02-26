import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ListMedicalSpecialtiesService } from '@/app/medical-specialty/services/list-medical-specialty.service';
import { ListMedicalSpecialtiesDto } from '@/app/medical-specialty/dtos/list-medical-specialties.dto';

@ApiTags('Especialidades médicas')
@ApiBearerAuth()
@Controller('/medical-specialties')
export class ListMedicalSpecialtiesController {
  constructor(
    private readonly listMedicalSpecialties: ListMedicalSpecialtiesService,
  ) {}

  @ApiOperation({
    summary: 'Listar especialidades médicas',
    description:
      'Lista todas as especialidades médicas cadastradas com filtros.',
  })
  @Get('/all')
  async handle(@Query() filters: ListMedicalSpecialtiesDto) {
    return this.listMedicalSpecialties.execute(filters);
  }
}
