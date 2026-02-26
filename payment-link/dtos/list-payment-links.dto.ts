import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { PaymentLinkStatus } from '../enums/payment-link.enum';
import { CurrencyType } from '@/app/payment/interfaces/payment.interfaces';
import { ListBase } from '@/infra/base/interfaces/pagination.interfaces';

export class ListPaymentLinksDto extends ListBase {
  @ApiPropertyOptional({
    description: 'Status do link de pagamento',
    example: PaymentLinkStatus.CREATED,
    enum: PaymentLinkStatus,
  })
  @IsOptional()
  @IsString({ message: 'O status do link de pagamento deve ser uma string.' })
  @IsEnum(PaymentLinkStatus, {
    message: 'O status do link de pagamento deve ser válido.',
  })
  status?: PaymentLinkStatus;

  @ApiPropertyOptional({
    description: 'Código da remessa',
    example: '0286',
  })
  @IsOptional()
  @IsString({ message: 'O código da remessa deve ser uma string' })
  invoice?: string;

  @ApiPropertyOptional({
    description: 'Moeda do link de pagamento',
    example: CurrencyType.BRL,
    enum: CurrencyType,
  })
  @IsOptional()
  @IsString({ message: 'A moeda do link de pagamento deve ser uma string' })
  @IsEnum(CurrencyType, {
    message: 'A moeda do link de pagamento deve ser válida',
  })
  currency?: CurrencyType;

  @ApiPropertyOptional({
    description: 'Código de rastreio',
    example: 'AR123456789BR',
  })
  @IsOptional()
  @IsString({ message: 'O código de rastreio deve ser uma string.' })
  shippingTracking?: string;

  @ApiPropertyOptional({
    description: 'Estado de entrega',
    example: 'SP',
  })
  @IsOptional()
  @IsString({ message: 'O estado de entrega deve ser uma string.' })
  shippingState?: string;

  @ApiPropertyOptional({
    description: 'Cidade de entrega',
    example: 'São Paulo',
  })
  @IsOptional()
  @IsString({ message: 'A cidade de entrega deve ser uma string.' })
  shippingCity?: string;

  @ApiPropertyOptional({
    description: 'Identificador do cliente',
    example: 'de4c8b8b-4b7b-4b7b-8b7b-4b7b8b7b4b7b',
  })
  @IsOptional()
  @IsString({ message: 'O identificador do cliente deve ser uma string.' })
  @IsUUID(4, { message: 'O identificador do cliente deve ser um UUIDv4.' })
  customerId?: string;

  @ApiPropertyOptional({
    description: 'Identificador do representante',
    example: 'de4c8b8b-4b7b-4b7b-8b7b-4b7b8b7b4b7b',
  })
  @IsOptional()
  @IsString({ message: 'O identificador do representante deve ser uma string.' })
  @IsUUID(4, { message: 'O identificador do representante deve ser um UUIDv4.' })
  representativeId?: string;

  @ApiPropertyOptional({
    description: 'Identificador do médico',
    example: 'de4c8b8b-4b7b-4b7b-8b7b-4b7b8b7b4b7b',
  })
  @IsOptional()
  @IsString({ message: 'O identificador do médico deve ser uma string.' })
  @IsUUID(4, { message: 'O identificador do médico deve ser um UUIDv4.' })
  doctorId?: string;

  @ApiPropertyOptional({
    description: 'Identificador da remessa',
    example: 'de4c8b8b-4b7b-4b7b-8b7b-4b7b8b7b4b7b',
  })
  @IsOptional()
  @IsString({ message: 'O identificador do link de pagamento deve ser uma string.' })
  @IsUUID(4, { message: 'O identificador do link de pagamento deve ser um UUIDv4.' })
  orderId?: string;
}
