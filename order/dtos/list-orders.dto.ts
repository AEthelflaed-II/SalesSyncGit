import { ListBase } from '@/infra/base/interfaces/pagination.interfaces';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { OrderStatus } from '../enums/order.enum';

export class ListOrdersDto extends ListBase {
  @ApiPropertyOptional({
    description: 'Status do pedido',
    example: OrderStatus.FINISHED,
    enum: OrderStatus,
  })
  @IsOptional()
  @IsString({ message: 'O status do pedido deve ser uma string.' })
  status?: string;

  @ApiPropertyOptional({
    description: 'Código do pedido',
    example: 'ETGV0286',
  })
  @IsOptional()
  @IsString({ message: 'O código do pedido deve ser uma string' })
  invoice?: string;

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
    description: 'ID do cliente',
    example: 'de4c8b8b-4b7b-4b7b-8b7b-4b7b8b7b4b7b',
  })
  @IsOptional()
  @IsString({ message: 'O ID do cliente deve ser uma string.' })
  @IsUUID(4, { message: 'O ID do cliente deve ser um UUIDv4.' })
  customerId?: string;

  @ApiPropertyOptional({
    description: 'ID do representante',
    example: 'de4c8b8b-4b7b-4b7b-8b7b-4b7b8b7b4b7b',
  })
  @IsOptional()
  @IsString({ message: 'O ID do representante deve ser uma string.' })
  @IsUUID(4, { message: 'O ID do representante deve ser um UUIDv4.' })
  representativeId?: string;

  @ApiPropertyOptional({
    description: 'ID do médico',
    example: 'de4c8b8b-4b7b-4b7b-8b7b-4b7b8b7b4b7b',
  })
  @IsOptional()
  @IsString({ message: 'O ID do médico deve ser uma string.' })
  @IsUUID(4, { message: 'O ID do médico deve ser um UUIDv4.' })
  doctorId?: string;
}
