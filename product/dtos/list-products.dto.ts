import { ListBase } from '@/infra/base/interfaces/pagination.interfaces';
import { ParseBoolean } from '@/infra/decorators/validation/parse-boolean.decorator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class ListProductsDto extends ListBase {
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
}
