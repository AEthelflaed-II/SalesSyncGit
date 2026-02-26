import { Controller, Delete, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeleteMedicalSpecialtyService } from '@/app/medical-specialty/services/delete-medical-specialty.service';
import { ResourceBaseParams } from '@/infra/base/interfaces/request-params.interfaces';

@ApiTags('Especialidades médicas')
@ApiBearerAuth()
@Controller('/medical-specialties')
export class DeleteMedicalSpecialtyController {
  constructor(
    private readonly deleteMedicalSpecialty: DeleteMedicalSpecialtyService,
  ) {}

  @Delete('/:id')
  @ApiOperation({
    summary: 'Excluir especialidade médica',
    description:
      'Exclui definitivamente uma especialidade médica na plataforma.',
  })
  async handle(@Param() { id }: ResourceBaseParams) {
    return this.deleteMedicalSpecialty.execute(id);
  }
}
