import { CreateDoctorService } from '@/app/doctor/services/create-doctor.service';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateDoctorRequestDto } from '../dtos/create-doctor.request.dto';

@ApiTags('Médicos')
@ApiBearerAuth()
@Controller('/doctors')
export class CreateDoctorController {
  constructor(private readonly createDoctor: CreateDoctorService) {}

  @Post()
  @ApiOperation({
    summary: 'Cadastrar médico (cadastro simplificado)',
    description: 'Cadastra um médico com base no nome e CRM informados.',
  })
  async handle(@Body() data: CreateDoctorRequestDto) {
    return this.createDoctor.execute(data.toCreate());
  }
}
