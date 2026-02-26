import { Body, Controller, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaymentService } from '@/app/payment/payment.service';
import { BrazilPaysWebhookRequestDto } from '@/infra/integration/brazilpays/dtos/brazilpays-webhook.dto';
import { ResourceBaseParams } from '@/infra/base/interfaces/request-params.interfaces';

@ApiTags('Pagamentos')
@Controller('/payments')
export class PaymentWebhooksController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiOperation({
    summary: 'Webhook de pagamentos BrazilPays',
    description: 'Atualiza o status do pagamento e envia e-mails de notificação.',
    externalDocs: {
      url: 'https://app.theneo.io/brazilpays/brazilpays/webhook',
      description: 'Documentação de integração do webhook na BrazilPays',
    },
  })
  @Post('/:id/wh/brazilpays')
  async brazilPaysWebhook(
    @Param() { id }: ResourceBaseParams,
    @Query('signature') signature: string,
    @Body() data: BrazilPaysWebhookRequestDto,
  ) {
    return this.paymentService.brazilPaysWebhook(id, signature, data);
  }
}
