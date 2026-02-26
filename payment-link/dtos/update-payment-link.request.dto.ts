import { PaymentLinkStatus } from '@/app/payment-link/enums/payment-link.enum';
import { PaymentMethod } from '@/app/payment/enums/payment.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdatePaymentLinkDto {
  @ApiPropertyOptional({
    description: 'Status do link de pagamento',
    enum: PaymentLinkStatus,
    example: PaymentLinkStatus.ACTIVE,
  })
  @IsOptional()
  @IsString({ message: 'Status do link de pagamento deve ser uma string' })
  @IsEnum(PaymentLinkStatus, {
    message: 'Status do link de pagamento deve ser válido',
  })
  status?: PaymentLinkStatus;

  @ApiPropertyOptional({
    description:
      'Identificador de referência da transação gerada na plataforma de pagamentos',
    example: '67eae0f4d70177d634b0684d',
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'Identificador de referência deve ser uma string' })
  referenceId?: string;

  @ApiPropertyOptional({
    description: 'Método de pagamento utilizado',
    enum: PaymentMethod,
  })
  @IsOptional()
  @IsString({ message: 'Método de pagamento deve ser uma string' })
  @IsEnum(PaymentMethod, {
    message: 'Método de pagamento deve ser válido',
  })
  paymentMethod?: PaymentMethod;

  @ApiPropertyOptional({
    description: 'Taxa de câmbio na hora do pagamento',
    example: 5.8109,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Taxa de câmbio deve ser um número' })
  exchangeAtPayment?: number;

  @ApiPropertyOptional({
    description: 'Quantidade de parcelas utilizadas',
    example: 6,
    type: Number,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Quantidade de parcelas deve ser um número' })
  installmentCustomer?: number;
}
