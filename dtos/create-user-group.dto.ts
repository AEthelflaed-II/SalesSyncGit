import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserGroupDto {
  @ApiProperty({
    description: 'Nome do grupo de usuários',
    example: 'Funcionários',
  })
  @IsNotEmpty({ message: 'O nome do grupo de usuários é obrigatório.' })
  @IsString({ message: 'O nome do grupo de usuários deve ser uma string.' })
  name: string;

  @ApiProperty({
    description: 'Tipo do grupo de usuários',
    example: 'employee',
    enum: ['admin', 'employee', 'representative', 'customer', 'doctor'],
  })
  @IsNotEmpty({ message: 'O tipo do grupo de usuários é obrigatório.' })
  @IsString({ message: 'O tipo do grupo de usuários deve ser uma string.' })
  @IsEnum(['admin', 'employee', 'representative', 'customer', 'doctor'], {
    message: 'O tipo do grupo de usuários deve ser um valor válido.',
  })
  type: string;

  @ApiPropertyOptional({
    description: 'Situação do grupo de usuários no sistema',
    example: true,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean({
    message: 'A situação do grupo de usuários deve ser um booleano.',
  })
  active: boolean;
}
