import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { IsCPF } from '@/infra/decorators/validation/is-cpf.decorator';
import { Type } from 'class-transformer';

export class Affiliation {
  @ApiPropertyOptional({
    description: 'Nome da mãe',
    example: 'Maria da Silva',
  })
  @IsOptional()
  @IsString({ message: 'Nome da mãe deve ser uma string' })
  motherName: string;

  @ApiPropertyOptional({
    description: 'Nome do pai',
    example: 'José da Silva',
  })
  @IsOptional()
  @IsString({ message: 'Nome do pai deve ser uma string' })
  fatherName: string;
}

export class CreateIdentityDto {
  @ApiProperty({
    description: 'Lado do documento',
    example: 'front',
  })
  @IsNotEmpty({ message: 'Lado do documento é obrigatório' })
  @IsString({ message: 'Lado do documento deve ser uma string' })
  side: 'front' | 'back';

  @ApiProperty({
    description: 'Nome da pessoa',
    example: 'João da Silva',
  })
  @IsNotEmpty({ message: 'Nome da pessoa é obrigatório' })
  @IsString({ message: 'Nome da pessoa deve ser uma string' })
  personName: string;

  @ApiProperty({
    description: 'CPF da pessoa',
    example: '12345678901',
  })
  @ValidateIf((object) => object.side === 'back')
  @IsNotEmpty({ message: 'CPF da pessoa é obrigatório' })
  @IsString({ message: 'CPF da pessoa deve ser uma string' })
  @IsCPF({ message: 'CPF da pessoa deve ser válido' })
  personCPF: string;

  @ApiProperty({
    description: 'Data de nascimento da pessoa',
    example: '1990-01-01T00:00:00.000-03:00',
  })
  @ValidateIf((object) => object.side === 'back')
  @IsNotEmpty({ message: 'Data de nascimento da pessoa é obrigatória' })
  @IsString({ message: 'Data de nascimento da pessoa deve ser uma string' })
  @IsDateString(
    { strict: true },
    { message: 'Data de nascimento da pessoa deve ser uma data válida' },
  )
  birthDate: string;

  @ApiPropertyOptional({
    description: 'Informações de filiação da pessoa',
    example: { motherName: 'Maria da Silva', fatherName: 'José da Silva' },
  })
  @IsOptional()
  @ValidateIf((object) => object.affiliation && typeof object.affiliation === 'object')
  @ValidateNested()
  @Type(() => Affiliation)
  affiliation: Affiliation;
}
