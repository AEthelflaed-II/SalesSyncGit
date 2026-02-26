import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Address } from './document.dto';
import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { IsCPF } from '@/infra/decorators/validation/is-cpf.decorator';

export class Person {
  @ApiProperty({
    description: 'Nome da pessoa',
    example: 'João da Silva',
  })
  @IsNotEmpty({ message: 'Nome da pessoa é obrigatório' })
  @IsString({ message: 'Nome da pessoa deve ser uma string' })
  name: string;

  @ApiProperty({
    description: 'CPF da pessoa',
    example: '12345678901',
  })
  @IsNotEmpty({ message: 'CPF da pessoa é obrigatório' })
  @IsString({ message: 'CPF da pessoa deve ser uma string' })
  @IsCPF({ message: 'CPF da pessoa deve ser válido' })
  cpf: string;

  @ApiPropertyOptional({
    description: 'Telefone da pessoa',
    example: '+5511999999999',
  })
  @IsString({ message: 'Telefone da pessoa deve ser uma string' })
  phone: string;

  @ApiPropertyOptional({
    description: 'Endereço da pessoa',
    type: Address,
  })
  @IsOptional()
  @ValidateNested({ message: 'O endereço da pessoa deve ser um objeto.' })
  @Type(() => Address)
  address: Address;
}

export class CreatePowerOfAttorneyDto {
  @ApiPropertyOptional({
    description: 'Data de assinatura',
    example: '2021-01-01T00:00:00-03:00',
  })
  @IsOptional()
  @IsString({ message: 'Data de assinatura deve ser uma string' })
  signatureDate: string;

  @ApiPropertyOptional({
    description: 'Data de validade',
    example: '2021-01-01T00:00:00-03:00',
  })
  @IsOptional()
  @IsString({ message: 'Data de validade deve ser uma string' })
  expirationDate: string;

  @ApiProperty({
    description: 'Pessoa que outorga a procuração/comprovante de vínculo',
    type: Person,
  })
  @IsNotEmptyObject({}, { message: 'O outorgante é obrigatório' })
  @ValidateNested({ message: 'O outorgante deve ser um objeto.' })
  @Type(() => Person)
  grantor: Person;

  @ApiProperty({
    description: 'Pessoa responsável autorizada',
    type: Person,
  })
  @IsNotEmptyObject({}, { message: 'Pessoa responsável é obrigatória' })
  @ValidateNested({ message: 'Pessoa responsável deve ser um objeto.' })
  attorney: Person;
}
