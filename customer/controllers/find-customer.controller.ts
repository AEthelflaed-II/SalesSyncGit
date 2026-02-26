import { Controller, Param, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FindUserService } from '@app/user/services/find-user.service';
import { FindCustomerRequestParams } from '../dtos/find-customer.request.dto';

@ApiTags('Clientes')
@ApiBearerAuth()
@Controller('/customers')
export class FindCustomerController {
  constructor(private readonly findUser: FindUserService) {}

  @Get('/find/:cpf')
  @ApiOperation({
    summary: 'Visualizar detalhes de cliente pelo CPF',
    description: 'Visualiza os detalhes de um cliente existente pelo CPF.',
  })
  async handle(@Param() { cpf }: FindCustomerRequestParams) {
    return this.findUser.byDocument(cpf);
  }
}
