import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateMedicalSpecialtyDto {
  @ApiProperty({
    description: 'Nome da especialidade médica.',
    example: 'Psiquiatria',
  })
  @IsNotEmpty({ message: 'Nome da especialidade médica é obrigatório.' })
  @IsString({ message: 'Nome da especialidade médica deve ser uma string.' })
  name: string;

  @ApiPropertyOptional({
    description: 'Descrição da especialidade médica.',
    example: 'Ciência que estuda a mente e o comportamento humano.',
  })
  @IsOptional()
  @IsString({
    message: 'Descrição da especialidade médica deve ser uma string.',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'Identificador do médico.',
    example: 'c4e2b9f4-4b3b-4b3b-8b3b-4b3b4b3b4b3b',
    format: 'uuid v4',
  })
  @IsOptional()
  @IsString({ message: 'Identificador do médico deve ser uma string.' })
  @IsUUID(4, { message: 'Identificador do médico deve ser um UUID v4.' })
  doctorId?: string;
}
