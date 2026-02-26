import { ListOrdersDto } from '@/app/order/dtos/list-orders.dto';
import { ListOrdersService } from '@/app/order/services/list-orders.service';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Pedidos')
@ApiBearerAuth()
@Controller('/orders')
export class ListOrdersController {
  constructor(private readonly listOrders: ListOrdersService) {}

  @Get('/all')
  @ApiOperation({
    summary: 'Listar pedidos',
    description: 'Lista todos os pedidos de venda.',
  })
  async handle(@Query() filters: ListOrdersDto) {
    return this.listOrders.execute(filters);
  }
}
