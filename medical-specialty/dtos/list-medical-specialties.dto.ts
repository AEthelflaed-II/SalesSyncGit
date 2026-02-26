import { ListBase } from '@/infra/base/interfaces/pagination.interfaces';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class ListMedicalSpecialtiesDto extends ListBase {
  @ApiPropertyOptional({
    description: 'Nome da especialidade médica',
    example: 'Psiquiatria',
  })
  @IsOptional()
  @IsString({ message: 'O nome da especialidade médica deve ser uma string.' })
  name?: string;

  @ApiPropertyOptional({
    description: 'Descrição da especialidade médica',
    example: 'Ciência que estuda a mente e o comportamento humano.',
  })
  @IsOptional()
  @IsString({
    message: 'A descrição da especialidade médica deve ser uma string.',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'Identificador do médico',
    example: 'c4e2b9f4-4b3b-4b3b-8b3b-4b3b4b3b4b3b',
  })
  @IsOptional()
  @IsString({ message: 'Identificador do médico deve ser uma string.' })
  @IsUUID(4, { message: 'Identificador do médico deve ser um UUID v4.' })
  doctorId?: string;
}
