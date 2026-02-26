import { Body, Controller, HttpCode, HttpStatus, Param, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateOrderStatusService } from '@/app/order/services/update-order-status.service';
import { UpdateOrderStatusRequestDto } from '../dtos/update-order-status.request.dto';
import { ResourceBaseParams } from '@/infra/base/interfaces/request-params.interfaces';
import { ActiveSession } from '@/infra/decorators/base/active-session.decorator';
import { IActiveSession } from '@/app/session/interfaces/session.dto';

@ApiTags('Pedidos')
@ApiBearerAuth()
@Controller('/orders')
export class UpdateOrderStatusController {
  constructor(private readonly updateOrderStatus: UpdateOrderStatusService) {}

  @Patch('/status/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Atualizar status do pedido',
    description: 'Atualiza o status de um pedido de venda.',
  })
  async handle(
    @ActiveSession() session: IActiveSession,
    @Param() { id }: ResourceBaseParams,
    @Body() data: UpdateOrderStatusRequestDto,
  ) {
    return this.updateOrderStatus.execute(session, id, data.status);
  }
}
