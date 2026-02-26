import { Controller, Body, Param, Put, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateOrderService } from '@/app/order/services/update-order.service';
import { ResourceBaseParams } from '@/infra/base/interfaces/request-params.interfaces';
import { UpdateOrderRequestDto } from '../dtos/update-order.request.dto';
import { ActiveSession } from '@/infra/decorators/base/active-session.decorator';
import { IActiveSession } from '@/app/session/interfaces/session.dto';

@ApiTags('Pedidos')
@ApiBearerAuth()
@Controller('/orders')
export class UpdateOrderController {
  constructor(private readonly updateOrder: UpdateOrderService) {}

  @Put('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Atualizar pedido',
    description: 'Atualiza um pedido de venda.',
  })
  async handle(
    @ActiveSession() session: IActiveSession,
    @Param() { id }: ResourceBaseParams,
    @Body() data: UpdateOrderRequestDto,
  ) {
    return this.updateOrder.execute(id, data.toUpdate(session));
  }
}
