import { ListPaymentLinksDto } from '@/app/payment-link/dtos/list-payment-links.dto';
import { ListPaymentLinksService } from '@/app/payment-link/services/list-payment-links.service';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Links de Pagamento')
@ApiBearerAuth()
@Controller('/payments/links')
export class ListPaymentLinksController {
  constructor(private readonly listPaymentLinks: ListPaymentLinksService) {}

  @Get('/all')
  @ApiOperation({
    summary: 'Listar links de pagamento',
    description: 'Lista todos os links de pagamento existentes na plataforma.',
  })
  async handle(@Query() filters: ListPaymentLinksDto) {
    return this.listPaymentLinks.execute(filters);
  }
}
