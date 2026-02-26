import { OrderStatus } from '@/app/order/enums/order.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class UpdateOrderStatusRequestDto {
  @ApiProperty({
    description: 'Status do pedido',
    example: OrderStatus.CANCELED,
  })
  @IsEnum(OrderStatus, { message: 'O status do pedido deve ser um valor válido.' })
  @IsNotEmpty({ message: 'O status do pedido é obrigatório.' })
  @IsString({ message: 'O status do pedido deve ser uma string.' })
  status: OrderStatus;
}
