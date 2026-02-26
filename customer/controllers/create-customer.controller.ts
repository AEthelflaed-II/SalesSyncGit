import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateCustomerService } from '@/app/customer/services/create-customer.service';
import { CreateCustomerRequestDto } from '../dtos/create-customer.request.dto';

@ApiTags('Clientes')
@ApiBearerAuth()
@Controller('/customers')
export class CreateCustomerController {
  constructor(private readonly createClient: CreateCustomerService) {}

  @Post()
  @ApiOperation({
    summary: 'Cadastrar cliente (cadastro simplificado)',
    description: 'Cadastra um cliente com base no nome e CPF informados.',
  })
  async handle(@Body() data: CreateCustomerRequestDto) {
    return this.createClient.execute(data.toCreate());
  }
}
