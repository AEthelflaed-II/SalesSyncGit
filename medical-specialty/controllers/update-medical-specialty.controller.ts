import { Body, Controller, Param, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateMedicalSpecialtyService } from '@/app/medical-specialty/services/update-medical-specialty.service';
import { UpdateMedicalSpecialtyDto } from '@/app/medical-specialty/dtos/update-medical-specialty.dto';
import { ResourceBaseParams } from '@/infra/base/interfaces/request-params.interfaces';

@ApiTags('Especialidades médicas')
@ApiBearerAuth()
@Controller('/medical-specialties')
export class UpdateMedicalSpecialtyController {
  constructor(
    private readonly updateMedicalSpecialty: UpdateMedicalSpecialtyService,
  ) {}

  @Put('/:id')
  @ApiOperation({
    summary: 'Atualizar especialidade médica',
    description: 'Atualiza uma especialidade médica existente na plataforma.',
  })
  async handle(
    @Param() { id }: ResourceBaseParams,
    @Body() data: UpdateMedicalSpecialtyDto,
  ) {
    return this.updateMedicalSpecialty.execute(id, data);
  }
}
