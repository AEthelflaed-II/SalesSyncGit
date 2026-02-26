import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { IsCPF } from '@/infra/decorators/validation/is-cpf.decorator';
import { Exclude } from 'class-transformer';

export class CreateAnvisaAuthorizationDto {
  @ApiProperty({
    description: 'Número de autorização da ANVISA',
    example: '12345678901',
  })
  @IsNotEmpty({ message: 'Número de autorização da ANVISA é obrigatório' })
  @IsString({ message: 'Número de autorização da ANVISA deve ser uma string' })
  authorizationNumber: string;

  @ApiProperty({
    description: 'Data de validade da autorização da ANVISA',
    example: '2026-01-01T00:00:00.000-03:00',
  })
  @IsNotEmpty({
    message: 'Data de validade da autorização da ANVISA é obrigatória',
  })
  @IsString({
    message: 'Data de validade da autorização da ANVISA deve ser uma string',
  })
  expirationDate: string;

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
  @IsNotEmpty({ message: 'CPF da pessoa é obrigatório' })
  @IsString({ message: 'CPF da pessoa deve ser uma string' })
  @IsCPF({ message: 'CPF da pessoa deve ser válido' })
  personCPF: string;

  @Exclude()
  legalGuardianRequired?: boolean;

  @ApiPropertyOptional({
    description: 'Nome do responsável legal',
    example: 'Maria da Silva',
  })
  @IsOptional()
  @IsString({ message: 'Nome do responsável legal deve ser uma string' })
  legalGuardianName: string;

  @ApiPropertyOptional({
    description: 'CPF do responsável legal',
    example: '12345678901',
  })
  @IsOptional()
  @IsString({ message: 'CPF do responsável legal deve ser uma string' })
  @IsCPF({ message: 'CPF do responsável legal deve ser válido' })
  legalGuardianCPF: string;

  @ApiPropertyOptional({
    description: 'Identificador do médico',
    example: '12345678-1234-1234-1234-123456789012',
  })
  @IsOptional()
  @IsString({ message: 'Identificador do médico deve ser uma string' })
  @IsUUID(4, { message: 'Identificador do médico deve ser um UUIDv4' })
  doctorId: string;

  @ApiProperty({
    description: 'Nome do médico',
    example: 'Dr. José da Silva',
  })
  @IsNotEmpty({ message: 'Nome do médico é obrigatório' })
  @IsString({ message: 'Nome do médico deve ser uma string' })
  doctorName: string;

  @ApiProperty({
    description: 'CRM do médico',
    example: '123456/PB',
  })
  @IsNotEmpty({ message: 'CRM do médico é obrigatório' })
  @IsString({ message: 'CRM do médico deve ser uma string' })
  doctorCRM: string;

  @ApiProperty({
    description: 'Tipo de produto',
    example: 'Entourage Canabidiol',
  })
  @IsNotEmpty({ message: 'Tipo de produto é obrigatório' })
  @IsString({ message: 'Tipo de produto deve ser uma string' })
  productType: string;

  @ApiProperty({
    description: 'Nome do fabricante',
    example: 'Entourage Phytolab LLC',
  })
  @IsNotEmpty({ message: 'Nome do fabricante é obrigatório' })
  @IsString({ message: 'Nome do fabricante deve ser uma string' })
  manufacturerName: string;

  @ApiPropertyOptional({
    description: 'CNPJ do fabricante',
    example: '12345678000101',
  })
  @IsString({ message: 'CNPJ do fabricante deve ser uma string' })
  manufacturerCNPJ: string;
}
