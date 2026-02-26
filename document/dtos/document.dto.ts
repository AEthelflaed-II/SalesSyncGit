import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { DocumentType } from '../interfaces/document-types.interfaces';
import { CreateIdentityDto } from './create-identity.dto';
import { CreateProofOfAddressDto } from './create-proof-of-address.dto';
import { CreatePowerOfAttorneyDto } from './create-power-of-attorney.dto';
import { CreateMedicalPrescriptionDto } from './create-medical-prescription.dto';
import { CreateAnvisaAuthorizationDto } from './create-anvisa-authorization.dto';
import { ParseUppercase } from '@/infra/decorators/validation/parse-uppercase.decorator';

export type DocumentMetadata =
  | CreateIdentityDto
  | CreateProofOfAddressDto
  | CreatePowerOfAttorneyDto
  | CreateMedicalPrescriptionDto
  | CreateAnvisaAuthorizationDto;

export class Document<
  T extends DocumentType,
  D extends DocumentMetadata = DocumentMetadata,
> {
  @ApiProperty({
    description: 'Tipo do documento',
    example: DocumentType.IDENTITY,
    enum: DocumentType,
  })
  @IsNotEmpty({ message: 'Tipo do documento é obrigatório' })
  @IsString({ message: 'Tipo do documento deve ser uma string' })
  @IsEnum(DocumentType, { message: 'Tipo do documento deve ser válido' })
  type: T;

  @ApiProperty({
    description: 'Titular do documento',
    example: 'patient',
    enum: ['patient', 'guardian'],
  })
  @IsEnum(['patient', 'guardian'], { message: 'Titular do documento deve ser válido' })
  @IsString({ message: 'Titular do documento deve ser uma string' })
  holder: 'patient' | 'guardian' | 'unknown' = 'unknown';

  @ApiProperty({
    description: 'Metadados do documento',
    example: {
      personName: 'João da Silva',
      personCPF: '12345678901',
      birthDate: '1990-01-01T00:00:00.000-03:00',
    },
  })
  @IsObject({ message: 'Metadados do documento deve ser um objeto' })
  data: D;
}

export class Address {
  @ApiProperty({
    description: 'Rua',
    example: 'Rua das Flores',
  })
  @IsNotEmpty({ message: 'Rua é obrigatória' })
  @IsString({ message: 'Rua deve ser uma string' })
  @ParseUppercase()
  street: string;

  @ApiProperty({
    description: 'Número',
    example: '123',
  })
  @IsNotEmpty({ message: 'Número é obrigatório' })
  @IsString({ message: 'Número deve ser uma string' })
  @ParseUppercase()
  number: string;

  @ApiPropertyOptional({
    description: 'Complemento',
    example: 'Casa',
  })
  @IsOptional()
  @IsString({ message: 'Complemento deve ser uma string' })
  @ParseUppercase()
  complement: string;

  @ApiPropertyOptional({
    description: 'Bairro',
    example: 'Centro',
  })
  @IsOptional()
  @IsString({ message: 'Bairro deve ser uma string' })
  @ParseUppercase()
  neighborhood: string;

  @ApiProperty({
    description: 'Cidade',
    example: 'São Paulo',
  })
  @IsNotEmpty({ message: 'Cidade é obrigatória' })
  @IsString({ message: 'Cidade deve ser uma string' })
  @ParseUppercase()
  city: string;

  @ApiProperty({
    description: 'Estado',
    example: 'SP',
  })
  @IsNotEmpty({ message: 'Estado é obrigatório' })
  @IsString({ message: 'Estado deve ser uma string' })
  @Length(2, 2, { message: 'Estado deve ter dois caracteres' })
  @ParseUppercase()
  state: string;

  @ApiProperty({
    description: 'Código postal (CEP)',
    example: '12345-678',
  })
  @IsNotEmpty({ message: 'Código postal é obrigatório' })
  @IsString({ message: 'Código postal deve ser uma string' })
  postalCode: string;
}
