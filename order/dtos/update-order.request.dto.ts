import { ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import { IsOptional, IsString, Length, MinLength, ValidateNested } from 'class-validator';
import { UpdateOrderDto } from '@/app/order/dtos/update-order.dto';
import { IActiveSession } from '@/app/session/interfaces/session.dto';
import { OrderStatus } from '@/app/order/enums/order.enum';
import { ParseUppercase } from '@/infra/decorators/validation/parse-uppercase.decorator';
import { ParseLowercase } from '@/infra/decorators/validation/parse-lowercase.decorator';

export class UpdateOrderShippingAddressRequestDto {
  @ApiPropertyOptional({
    description: 'Rua',
    example: 'Rua das Flores',
  })
  @IsOptional()
  @IsString({ message: 'A rua deve ser uma string.' })
  @ParseUppercase()
  street: string;

  @ApiPropertyOptional({
    description: 'Número',
    example: '123',
  })
  @IsOptional()
  @IsString({ message: 'O número deve ser uma string.' })
  @ParseUppercase()
  number: string;

  @ApiPropertyOptional({
    description: 'Complemento',
    example: 'Casa',
  })
  @IsOptional()
  @IsString({ message: 'O complemento deve ser uma string.' })
  @ParseUppercase()
  complement?: string;

  @ApiPropertyOptional({
    description: 'Bairro',
    example: 'Centro',
  })
  @IsOptional()
  @IsString({ message: 'O bairro deve ser uma string.' })
  @ParseUppercase()
  neighborhood: string;

  @ApiPropertyOptional({
    description: 'Cidade',
    example: 'São Paulo',
  })
  @IsOptional()
  @IsString({ message: 'A cidade deve ser uma string.' })
  @ParseUppercase()
  city: string;

  @ApiPropertyOptional({
    description: 'Estado',
    example: 'SP',
  })
  @IsOptional()
  @IsString({ message: 'O estado deve ser uma string.' })
  @Length(2, 2, { message: 'O estado deve ter dois caracteres.' })
  @ParseUppercase()
  state: string;

  @ApiPropertyOptional({
    description: 'País',
    example: 'Brasil',
  })
  @IsString({ message: 'O país deve ser uma string.' })
  @ParseUppercase()
  country: string;

  @ApiPropertyOptional({
    description: 'CEP',
    example: '12345-678',
  })
  @IsOptional()
  @IsString({ message: 'O CEP deve ser uma string.' })
  @MinLength(8, { message: 'O CEP deve ter ao menos 8 caracteres' })
  @ParseUppercase()
  postalCode: string;
}

export class UpdateOrderShippingRequestDto {
  @ApiPropertyOptional({
    description: 'Endereço de entrega',
    type: UpdateOrderShippingAddressRequestDto,
  })
  @IsOptional()
  @ValidateNested({ message: 'O endereço de entrega deve ser um objeto.' })
  @Type(() => UpdateOrderShippingAddressRequestDto)
  address?: UpdateOrderShippingAddressRequestDto;
}

export class UpdateOrderRequestDto {
  @ApiPropertyOptional({
    description: 'Status do pedido',
    example: OrderStatus.CONFIRMED,
    enum: [OrderStatus.CONFIRMED],
  })
  @IsOptional()
  @IsString({ message: 'O status do pedido deve ser uma string.' })
  @ParseLowercase()
  status?: OrderStatus;

  @Exclude()
  invoice?: string;

  @Exclude()
  customerId?: string;

  @Exclude()
  representativeId?: string;

  @Exclude()
  doctorId?: string;

  @ApiPropertyOptional({
    description: 'Informações de envio',
    type: UpdateOrderShippingRequestDto,
  })
  @IsOptional()
  @ValidateNested({ message: 'A informação de envio deve ser um objeto.' })
  @Type(() => UpdateOrderShippingRequestDto)
  shipping?: UpdateOrderShippingRequestDto;

  toUpdate(session: IActiveSession): UpdateOrderDto {
    return {
      status: this.status,
      invoice: this.invoice,
      updatedById: session.user.id,
      shipping: {
        address: this.shipping?.address,
      },
    };
  }
}
