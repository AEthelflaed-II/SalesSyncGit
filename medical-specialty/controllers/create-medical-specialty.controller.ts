import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateMedicalSpecialtyService } from '@/app/medical-specialty/services/create-medical-specialty.service';
import { CreateMedicalSpecialtyDto } from '@/app/medical-specialty/dtos/create-medical-specialty.dto';
import { IActiveSession } from '@/app/session/interfaces/session.dto';
import { ActiveSession } from '@/infra/decorators/base/active-session.decorator';

@ApiTags('Especialidades médicas')
@ApiBearerAuth()
@Controller('/medical-specialties')
export class CreateMedicalSpecialtyController {
  constructor(
    private readonly createMedicalSpecialty: CreateMedicalSpecialtyService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Criar especialidade médica',
    description:
      'Cria uma especialidade médica na plataforma. Se o campo `doctorId` for informado, a especialidade será criada e vinculada ao médico.',
  })
  async handle(
    @ActiveSession() session: IActiveSession,
    @Body() data: CreateMedicalSpecialtyDto,
  ) {
    return this.createMedicalSpecialty.execute(data);
  }
}
