import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Transform, Type } from 'class-transformer';
import { UserStatus } from '../enums/user.enum';
import { ParseUppercase } from '@/infra/decorators/validation/parse-uppercase.decorator';
import { ParseLowercase } from '@/infra/decorators/validation/parse-lowercase.decorator';
import { removeDocumentMask, validateDocument } from '@/common/utils/document';

export class CreateUserProfileDto {
  @ApiProperty({
    description: 'Primeiro nome do usuário',
    example: 'João',
  })
  @IsNotEmpty({ message: 'O primeiro nome do usuário é obrigatório.' })
  @IsString({ message: 'O primeiro nome do usuário deve ser uma string.' })
  @ParseUppercase()
  firstName: string;

  @ApiPropertyOptional({
    description: 'Sobrenome do usuário',
    example: 'da Silva',
  })
  @IsOptional()
  @IsString({ message: 'O sobrenome do usuário deve ser uma string.' })
  @ParseUppercase()
  lastName?: string;

  @ApiProperty({
    description: 'E-mail do usuário',
    example: 'joaodasilva@email.com',
  })
  @IsNotEmpty({ message: 'O e-mail do usuário é obrigatório.' })
  @IsString({ message: 'O e-mail do usuário deve ser uma string.' })
  @IsEmail({}, { message: 'O e-mail do usuário deve ser um e-mail válido.' })
  @ParseLowercase()
  email?: string;

  @ApiPropertyOptional({
    description: 'Telefone do usuário',
    example: '+5583999999999',
  })
  @IsOptional()
  @IsString({ message: 'O telefone do usuário deve ser uma string.' })
  phone?: string;
}

export class CreateUserAddressDto {
  @ApiProperty({
    description: 'Rua do endereço',
    example: 'Rua do Endereço',
  })
  @IsNotEmpty({ message: 'A rua do endereço é obrigatória.' })
  @IsString({ message: 'A rua do endereço deve ser uma string.' })
  @ParseUppercase()
  street: string;

  @ApiProperty({
    description: 'Número do endereço',
    example: '123',
  })
  @IsString({ message: 'O número do endereço deve ser uma string.' })
  @ParseUppercase()
  number: string;

  @ApiPropertyOptional({
    description: 'Complemento do endereço',
    example: 'Casa',
  })
  @IsOptional()
  @IsString({ message: 'O complemento do endereço deve ser uma string.' })
  @ParseUppercase()
  complement?: string;

  @ApiProperty({
    description: 'Bairro do endereço',
    example: 'Bairro do Endereço',
  })
  @IsNotEmpty({ message: 'O bairro do endereço é obrigatório.' })
  @IsString({ message: 'O bairro do endereço deve ser uma string.' })
  @ParseUppercase()
  neighborhood: string;

  @ApiProperty({
    description: 'Cidade do endereço',
    example: 'Cidade do Endereço',
  })
  @IsNotEmpty({ message: 'A cidade do endereço é obrigatória.' })
  @IsString({ message: 'A cidade do endereço deve ser uma string.' })
  @ParseUppercase()
  city: string;

  @ApiProperty({
    description: 'Estado do endereço',
    example: 'Estado do Endereço',
  })
  @IsNotEmpty({ message: 'O estado do endereço é obrigatório.' })
  @IsString({ message: 'O estado do endereço deve ser uma string.' })
  @ParseUppercase()
  state: string;

  @ApiProperty({
    description: 'País do endereço',
    example: 'País do Endereço',
  })
  @IsNotEmpty({ message: 'O país do endereço é obrigatório.' })
  @IsString({ message: 'O país do endereço deve ser uma string.' })
  @ParseUppercase()
  country: string;

  @ApiProperty({
    description: 'CEP do endereço',
    example: '58000-000',
  })
  @IsNotEmpty({ message: 'O CEP do endereço é obrigatório.' })
  @IsString({ message: 'O CEP do endereço deve ser uma string.' })
  postalCode: string;
}

export class CreateUserDto {
  @ApiProperty({
    description: 'Documento do usuário (CPF, CNPJ, Código de representante, etc.)',
    example: '12345678910',
  })
  @IsNotEmpty({ message: 'O documento do usuário é obrigatório.' })
  @IsString({ message: 'O documento do usuário deve ser uma string.' })
  @Transform(({ value }) => (validateDocument(value) ? removeDocumentMask(value) : value))
  document: string;

  @Exclude()
  password: string;

  @ApiProperty({
    description: 'ID do grupo de usuários ao qual o usuário faz parte',
    example: '8c7b3b7d-1b1b-4b3b-8c7d-1b1b4b3b8c7d',
    format: 'uuid',
  })
  @IsNotEmpty({ message: 'O ID do grupo de usuários é obrigatório.' })
  @IsString({ message: 'O ID do grupo de usuários deve ser uma string.' })
  @IsUUID(4, { message: 'O ID do grupo de usuários deve ser um UUID v4.' })
  groupId: string;

  @ApiPropertyOptional({
    description: 'ID do representante ao qual o usuário faz parte',
    example: '8c7b3b7d-1b1b-4b3b-8c7d-1b1b4b3b8c7d',
    format: 'uuid',
  })
  @IsOptional()
  @IsString({ message: 'O ID do representante deve ser uma string.' })
  @IsUUID(4, { message: 'O ID do representante deve ser um UUID v4.' })
  representativeId?: string;

  @ApiProperty({
    description: 'Perfil do usuário',
    type: CreateUserProfileDto,
  })
  @IsNotEmpty({ message: 'O perfil do usuário é obrigatório.' })
  @ValidateNested({ message: 'O perfil do usuário deve ser um objeto.' })
  @Type(() => CreateUserProfileDto)
  profile: CreateUserProfileDto;

  @ApiPropertyOptional({
    description: 'Endereços do usuário',
    type: CreateUserAddressDto,
    isArray: true,
  })
  @IsOptional()
  @ValidateNested({
    each: true,
    message: 'Os endereços do usuário devem ser um array de objetos.',
  })
  @Type(() => CreateUserAddressDto)
  adresses?: CreateUserAddressDto[];

  @Exclude()
  status?: UserStatus;
}
