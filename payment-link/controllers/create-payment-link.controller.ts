import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreatePaymentLinkService } from '@/app/payment-link/services/create-payment-link.service';
import { CreatePaymentLinkRequestDto } from '../dtos/create-payment-link.request.dto';

@ApiTags('Links de Pagamento')
@ApiBearerAuth()
@Controller('/payments/links')
export class CreatePaymentLinkController {
  constructor(private readonly createPaymentLink: CreatePaymentLinkService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar link de pagamento',
    description: 'Cria um link de pagamento para uma remessa existente na plataforma.',
  })
  async handle(@Body() data: CreatePaymentLinkRequestDto) {
    return this.createPaymentLink.execute(data);
  }
}
