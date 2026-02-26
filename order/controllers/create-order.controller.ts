import { Controller, Body, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateOrderService } from '@app/order/services/create-order.service';
import { ActiveSession } from '@infra/decorators/base/active-session.decorator';
import { IActiveSession } from '@app/session/interfaces/session.dto';
import { CreateOrderRequestDto } from '../dtos/create-order.request.dto';

@ApiTags('Pedidos')
@ApiBearerAuth()
@Controller('/orders')
export class CreateOrderController {
  constructor(private readonly createOrder: CreateOrderService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar pedido',
    description: 'Cria um novo pedido de venda.',
  })
  async handle(
    @ActiveSession() session: IActiveSession,
    @Body() data: CreateOrderRequestDto,
  ) {
    return this.createOrder.execute(session, data);
  }
}
