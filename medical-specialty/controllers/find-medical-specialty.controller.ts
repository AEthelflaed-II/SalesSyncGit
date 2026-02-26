import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FindMedicalSpecialtyService } from '@/app/medical-specialty/services/find-medical-specialty.service';
import { ResourceBaseParams } from '@/infra/base/interfaces/request-params.interfaces';

@ApiTags('Especialidades médicas')
@ApiBearerAuth()
@Controller('/medical-specialties')
export class FindMedicalSpecialtyController {
  constructor(
    private readonly findMedicalSpecialty: FindMedicalSpecialtyService,
  ) {}

  @Get('/find/:id')
  @ApiOperation({
    summary: 'Visualizar detalhes de especialidade médica',
    description: 'Visualiza os detalhes de uma especialidade médica existente.',
  })
  async handle(@Param() { id }: ResourceBaseParams) {
    return this.findMedicalSpecialty.execute(id);
  }
}
