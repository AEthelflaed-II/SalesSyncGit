import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FindPaymentLinkService } from '@/app/payment-link/services/find-payment-link.service';
import { ResourceBaseParams } from '@/infra/base/interfaces/request-params.interfaces';

@ApiTags('Links de Pagamento')
@ApiBearerAuth()
@Controller('/payments/links')
export class FindPaymentLinkController {
  constructor(private readonly findPaymentLink: FindPaymentLinkService) {}

  @Get('/find/:id')
  @ApiOperation({
    summary: 'Visualizar link de pagamento',
    description: 'Visualiza um link de pagamento criado na plataforma.',
  })
  async handle(@Param() { id }: ResourceBaseParams) {
    return this.findPaymentLink.execute(id);
  }
}
