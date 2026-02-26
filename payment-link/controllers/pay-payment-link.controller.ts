import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PayPaymentLinkService } from '@/app/payment-link/services/pay-payment-link.service';
import { PayPaymentLinkRequestDto } from '../dtos/pay-payment-link.request.dto';
import { ResourceBaseParams } from '@/infra/base/interfaces/request-params.interfaces';

@ApiTags('Links de Pagamento')
@ApiBearerAuth()
@Controller('/payments/links')
export class PayPaymentLinkController {
  constructor(private readonly payPaymentLink: PayPaymentLinkService) {}

  @Post('/:id/pay')
  @ApiOperation({
    summary: 'Pagar link de pagamento',
    description: 'Realiza o pagamento de um link de pagamento.',
  })
  async handle(
    @Param() { id }: ResourceBaseParams,
    @Body() data: PayPaymentLinkRequestDto,
  ) {
    return this.payPaymentLink.execute(data.setPaymentLinkId(id));
  }
}
