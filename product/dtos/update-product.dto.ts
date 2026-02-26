import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProductDto {
  @ApiPropertyOptional({
    description: 'Nome do produto',
    example: 'Produto 1',
  })
  @IsNotEmpty({ message: 'O nome do produto é obrigatório.' })
  @IsString({ message: 'O nome do produto deve ser uma string.' })
  name?: string;

  @ApiPropertyOptional({
    description: 'Descrição do produto',
    example: 'Descrição do produto 1',
  })
  @IsOptional()
  @IsString({ message: 'A descrição do produto deve ser uma string.' })
  description?: string;

  @ApiPropertyOptional({
    description: 'SKU do produto',
    example: 'SKU-001',
  })
  @IsOptional()
  sku?: string;

  @ApiPropertyOptional({
    description: 'Código HS do produto',
    example: '94821741',
  })
  @IsOptional()
  @IsString({ message: 'O código HS do produto deve ser uma string.' })
  hsCode: string;

  @ApiPropertyOptional({
    description: 'Preço do produto (em dólares)',
    example: 139.99,
  })
  @IsOptional()
  @IsNumber({}, { message: 'O preço do produto deve ser um número (em dólares).' })
  price?: number;
}
