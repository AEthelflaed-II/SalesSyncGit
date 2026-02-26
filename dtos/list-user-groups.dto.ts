import { ListBase } from '@/infra/base/interfaces/pagination.interfaces';
import { ParseBoolean } from '@/infra/decorators/validation/parse-boolean.decorator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';

export class ListUserGroupsDto extends ListBase {
  @ApiPropertyOptional({
    description: 'Nome do grupo',
    example: 'Grupo 1',
  })
  @IsOptional()
  @IsString({ message: 'O nome do grupo deve ser uma string.' })
  name?: string;

  @ApiPropertyOptional({
    description: 'Tipo do grupo',
    example: 'employee',
    enum: ['admin', 'employee', 'representative', 'customer', 'doctor'],
  })
  @IsOptional()
  @IsString({ message: 'O tipo do grupo deve ser uma string.' })
  @IsEnum(['admin', 'employee', 'representative', 'customer', 'doctor'], {
    message: 'O tipo do grupo deve ser um valor válido.',
  })
  type?: string;

  @ApiPropertyOptional({
    description: 'Situação do grupo no sistema',
    example: true,
    type: Boolean,
  })
  @IsOptional()
  @ParseBoolean()
  @IsBoolean({ message: 'A situação do grupo deve ser um booleano.' })
  active?: boolean;
}
