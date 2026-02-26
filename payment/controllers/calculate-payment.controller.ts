import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CalculatePaymentService } from '@/app/payment/services/calculate-payment.service';
import { CalculatePaymentRequestDto } from '../dtos/calculate-payment.dto';

@ApiTags('Pagamentos')
@ApiBearerAuth()
@Controller('/payments')
export class CalculatePaymentController {
  constructor(private readonly calculatePayment: CalculatePaymentService) {}

  @Post('/calculate')
  @ApiOperation({
    summary: 'Calcular pagamento',
    description: 'Calcula o valor do pagamento.',
  })
  async handle(
    @Body() { value, currency, feeForMerchant, installment }: CalculatePaymentRequestDto,
  ) {
    return this.calculatePayment.execute({
      value,
      currency,
      feeForMerchant,
      installment,
    });
  }
}
