import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CurrencyType } from '@/app/payment/interfaces/payment.interfaces';

export class CalculatePaymentRequestDto {
  @ApiProperty({
    description: 'Valor do pagamento.',
    example: 139.99,
  })
  @IsNotEmpty({ message: 'O valor do pagamento é obrigatório.' })
  @IsNumber({}, { message: 'O valor do pagamento deve ser um número.' })
  value: number;

  @ApiProperty({
    description: 'Moeda do pagamento.',
    example: CurrencyType.BRL,
    enum: CurrencyType,
  })
  @IsNotEmpty({ message: 'A moeda do pagamento é obrigatória.' })
  @IsString({
    message: 'A moeda do pagamento deve ser uma string.',
  })
  @IsEnum(CurrencyType, { message: 'A moeda do pagamento deve ser BRL ou USD.' })
  currency: CurrencyType;

  @ApiProperty({
    description: 'Se o pagamento é para o comerciante.',
    example: true,
  })
  @IsNotEmpty({ message: 'Se o pagamento é para o comerciante é obrigatório.' })
  @IsBoolean({ message: 'Se o pagamento é para o comerciante deve ser um booleano.' })
  feeForMerchant: boolean;

  @ApiProperty({
    description: 'Número de parcelas.',
    example: 1,
  })
  @ValidateIf((object, _) => object.feeForMerchant)
  @IsNotEmpty({ message: 'O número de parcelas é obrigatório.' })
  @IsNumber({}, { message: 'O número de parcelas deve ser um número.' })
  @Min(1, { message: 'O número de parcelas deve ser no mínimo 1.' })
  @Max(12, { message: 'O número de parcelas deve ser no máximo 12.' })
  installment: number;
}
