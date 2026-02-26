import { ListBase } from '@/infra/base/interfaces/pagination.interfaces';
import { ParseBoolean } from '@/infra/decorators/validation/parse-boolean.decorator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

export class ListStockProductsDto extends ListBase {
  @ApiPropertyOptional({
    description: 'Nome do produto',
    example: 'Produto 1',
  })
  @IsOptional()
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
  @IsString({ message: 'O SKU do produto deve ser uma string.' })
  sku?: string;

  @ApiPropertyOptional({
    type: 'boolean',
    description: 'Status do produto',
  })
  @IsOptional()
  @ParseBoolean()
  @IsBoolean({ message: 'O status do produto deve ser um booleano.' })
  active?: boolean;

  @ApiPropertyOptional({
    description: 'Identificador do estoque',
    example: 'de4c8b8b-4b7b-4b7b-8b7b-4b7b8b7b4b7b',
  })
  @IsOptional()
  @IsString({ message: 'O identificador do estoque deve ser uma string.' })
  @IsUUID(4, { message: 'O identificador do estoque deve ser um UUIDv4.' })
  stockId?: string;

  setStockId(stockId: string) {
    this.stockId = stockId;
    return this;
  }
}
