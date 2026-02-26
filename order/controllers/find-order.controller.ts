import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FindOrderService } from '@/app/order/services/find-order.service';
import { ResourceBaseParams } from '@/infra/base/interfaces/request-params.interfaces';

@ApiTags('Pedidos')
@ApiBearerAuth()
@Controller('/orders')
export class FindOrderController {
  constructor(private readonly findOrder: FindOrderService) {}

  @Get('/find/:id')
  @ApiOperation({
    summary: 'Visualizar pedido',
    description: 'Visualiza um pedido pelo identificador único.',
  })
  async handle(@Param() { id }: ResourceBaseParams) {
    return this.findOrder.execute(id);
  }
}
