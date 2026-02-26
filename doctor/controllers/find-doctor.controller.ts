import { Controller, Param, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FindUserService } from '@app/user/services/find-user.service';
import { FindDoctorRequestParams } from '../dtos/find-doctor.request.dto';

@ApiTags('Médicos')
@ApiBearerAuth()
@Controller('/doctors')
export class FindDoctorController {
  constructor(private readonly findUser: FindUserService) {}

  @Get('/find/:crmNumber/:crmState')
  @ApiOperation({
    summary: 'Visualizar detalhes de médico pelo CRM',
    description: 'Visualiza os detalhes de um médico existente pelo CRM.',
  })
  async handle(@Param() { crmNumber, crmState }: FindDoctorRequestParams) {
    return this.findUser.byDocument(`${crmNumber}/${crmState}`);
  }
}
