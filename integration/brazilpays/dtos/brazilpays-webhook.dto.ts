import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import {
  BrazilPaysB2EStatus,
  BrazilPaysPaymentStatus,
} from '../interfaces/brazilpays.interfaces';

export class BrazilPaysWebhookRequestDto {
  @ApiProperty({
    description: 'ID da transação',
    example: 'de305d54-75b4-431b-adb2-eb6b9e546014',
  })
  @IsOptional()
  id: string;

  @ApiProperty({
    description: 'Status da transação',
    example: BrazilPaysPaymentStatus.PAID,
    enum: BrazilPaysPaymentStatus,
  })
  @IsOptional()
  paymentStatus: number;

  @ApiProperty({
    description: 'Valor da transação',
    example: 139.99,
  })
  @IsOptional()
  amount: number;

  @ApiProperty({
    description: 'Status da checagem de fraude',
    example: BrazilPaysB2EStatus.APPROVED,
    enum: BrazilPaysB2EStatus,
  })
  @IsOptional()
  b2EStatus: number;

  @ApiProperty({
    description: 'UUID da transação no gateway de pagamentos',
    example: 'de305d54-75b4-431b-adb2-eb6b9e546014',
  })
  @IsOptional()
  transactionUuid: string;

  @ApiProperty({
    description: 'ID do link de pagamento',
    example: 'de305d54-75b4-431b-adb2-eb6b9e546014',
  })
  @IsOptional()
  baseChargeId: string;

  @ApiProperty({
    description: 'Referência da transação',
    example: 'de305d54-75b4-431b-adb2-eb6b9e546014',
  })
  @IsOptional()
  reference: string;
}
