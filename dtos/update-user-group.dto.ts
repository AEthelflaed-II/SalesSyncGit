import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserGroupDto {
  @ApiPropertyOptional({
    description: 'Nome do grupo de usuário',
    example: 'Funcionários',
  })
  @IsOptional()
  @IsString({ message: 'O nome do grupo de usuários deve ser uma string.' })
  name?: string;

  @ApiPropertyOptional({
    description: 'Situação do grupo de usuários no sistema',
    example: true,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean({
    message: 'A situação do grupo de usuários deve ser um booleano.',
  })
  active?: boolean;
}
