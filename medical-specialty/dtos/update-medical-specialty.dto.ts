import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateMedicalSpecialtyDto {
  @ApiPropertyOptional({
    description: 'Nome da especialidade médica.',
    example: 'Psiquiatria',
  })
  @IsOptional()
  @IsString({ message: 'Nome da especialidade médica deve ser uma string.' })
  name?: string;

  @ApiPropertyOptional({
    description: 'Descrição da especialidade médica.',
    example: 'Descrição da especialidade médica.',
  })
  @IsOptional()
  @IsString({
    message: 'Descrição da especialidade médica deve ser uma string.',
  })
  description?: string;
}
