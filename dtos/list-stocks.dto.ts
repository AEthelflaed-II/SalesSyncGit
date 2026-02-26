import { ListBase } from '@/infra/base/interfaces/pagination.interfaces';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class ListStocksDto extends ListBase {
  @ApiPropertyOptional({
    description: 'Código do estoque',
    example: 277,
  })
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 0 },
    { message: 'O código do estoque deve ser um número.' },
  )
  @IsInt({ message: 'O código do estoque deve ser um número inteiro.' })
  code?: number;

  @ApiPropertyOptional({
    description: 'Nome do estoque',
    example: 'TriStar',
  })
  @IsOptional()
  @IsString({ message: 'O nome do estoque deve ser uma string.' })
  name?: string;

  @ApiPropertyOptional({
    description: 'Identificador do produto',
    example: 'de4c8b8b-4b7b-4b7b-8b7b-4b7b8b7b4b7b',
  })
  @IsOptional()
  @IsString({ message: 'O identificador do produto deve ser uma string.' })
  @IsUUID(4, { message: 'O identificador do produto deve ser um UUIDv4.' })
  productId?: string;
}
