import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Nome do produto',
    example: 'Produto 1',
  })
  @IsNotEmpty({ message: 'O nome do produto é obrigatório.' })
  @IsString({ message: 'O nome do produto deve ser uma string.' })
  name: string;

  @ApiPropertyOptional({
    description: 'Descrição do produto',
    example: 'Descrição do produto 1',
  })
  @IsOptional()
  @IsString({ message: 'A descrição do produto deve ser uma string.' })
  description?: string;

  @ApiProperty({
    description: 'SKU do produto',
    example: 'SKU-001',
  })
  @IsNotEmpty({ message: 'O SKU do produto é obrigatório.' })
  @IsString({ message: 'O SKU do produto deve ser uma string.' })
  sku: string;

  @ApiProperty({
    description: 'Código HS do produto',
    example: '94821741',
  })
  @IsNotEmpty({ message: 'O código HS do produto é obrigatório.' })
  @IsString({ message: 'O código HS do produto deve ser uma string.' })
  hsCode: string;

  @ApiProperty({
    description: 'Concentração do produto',
    example: '7000mg',
  })
  @IsNotEmpty({ message: 'A concentração do produto é obrigatória.' })
  @IsString({ message: 'A concentração do produto deve ser uma string.' })
  concentration: string;

  @ApiProperty({
    description: 'Preço do produto (em dólares)',
    example: 139.99,
  })
  @IsNotEmpty({ message: 'O preço do produto é obrigatório.' })
  @IsNumber({}, { message: 'O preço do produto deve ser um número (em dólares).' })
  price: number;

  @ApiPropertyOptional({
    description: 'Quantidade em estoque',
    example: 10,
  })
  @IsOptional()
  @IsNumber({}, { message: 'A quantidade em estoque deve ser um número.' })
  inventory?: number;
}
