import { IsEmail, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { ParseUppercase } from '@/infra/decorators/validation/parse-uppercase.decorator';
import { ParseLowercase } from '@/infra/decorators/validation/parse-lowercase.decorator';
import { removeDocumentMask } from '@/common/utils/document';

export class UpdateUserProfileDto {
  @ApiPropertyOptional({
    description: 'Primeiro nome do usuário',
    example: 'João',
  })
  @IsOptional()
  @IsString({ message: 'O primeiro nome do usuário deve ser uma string.' })
  @ParseUppercase()
  firstName?: string;

  @ApiPropertyOptional({
    description: 'Sobrenome do usuário',
    example: 'da Silva',
  })
  @IsOptional()
  @IsString({ message: 'O sobrenome do usuário deve ser uma string.' })
  @ParseUppercase()
  lastName?: string;

  @ApiPropertyOptional({
    description: 'E-mail do usuário',
    example: 'joaodasilva@email.com',
  })
  @IsOptional()
  @IsString({ message: 'O e-mail do usuário deve ser uma string.' })
  @IsEmail({}, { message: 'O e-mail do usuário deve ser um e-mail válido.' })
  @ParseLowercase()
  email: string;

  @ApiPropertyOptional({
    description: 'Telefone do usuário',
    example: '+5583999999999',
  })
  @IsOptional()
  @IsString({ message: 'O telefone do usuário deve ser uma string.' })
  phone?: string;
}

export class UpdateUserAddressDto {
  @ApiPropertyOptional({
    description: 'Rua do endereço',
    example: 'Rua do Endereço',
  })
  @IsOptional()
  @IsString({ message: 'A rua do endereço deve ser uma string.' })
  @ParseUppercase()
  street?: string;

  @ApiPropertyOptional({
    description: 'Número do endereço',
    example: '123',
  })
  @IsOptional()
  @IsString({ message: 'O número do endereço deve ser uma string.' })
  @ParseUppercase()
  number?: string;

  @ApiPropertyOptional({
    description: 'Complemento do endereço',
    example: 'Casa',
  })
  @IsOptional()
  @IsString({ message: 'O complemento do endereço deve ser uma string.' })
  @ParseUppercase()
  complement?: string;

  @ApiPropertyOptional({
    description: 'Bairro do endereço',
    example: 'Bairro do Endereço',
  })
  @IsOptional()
  @IsString({ message: 'O bairro do endereço deve ser uma string.' })
  @ParseUppercase()
  neighborhood?: string;

  @ApiPropertyOptional({
    description: 'Cidade do endereço',
    example: 'Cidade do Endereço',
  })
  @IsOptional()
  @IsString({ message: 'A cidade do endereço deve ser uma string.' })
  @ParseUppercase()
  city?: string;

  @ApiPropertyOptional({
    description: 'Estado do endereço',
    example: 'Estado do Endereço',
  })
  @IsOptional()
  @IsString({ message: 'O estado do endereço deve ser uma string.' })
  @ParseUppercase()
  state?: string;

  @ApiPropertyOptional({
    description: 'País do endereço',
    example: 'País do Endereço',
  })
  @IsOptional()
  @IsString({ message: 'O país do endereço deve ser uma string.' })
  @ParseUppercase()
  country?: string;

  @ApiPropertyOptional({
    description: 'CEP do endereço',
    example: '58000-000',
  })
  @IsOptional()
  @IsString({ message: 'O CEP do endereço deve ser uma string.' })
  @ParseUppercase()
  postalCode?: string;
}

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Documento do usuário (CPF, CNPJ, Código de representante, etc.)',
    example: '12345678910',
  })
  @IsOptional()
  @IsString({ message: 'O documento do usuário deve ser uma string.' })
  @Transform(({ value }) => removeDocumentMask(value))
  document?: string;

  @ApiPropertyOptional({
    description: 'Senha do usuário',
    example: '123456',
  })
  @IsOptional()
  @IsString({ message: 'A senha do usuário deve ser uma string.' })
  password?: string;

  @ApiPropertyOptional({
    description: 'ID do grupo de usuários ao qual o usuário faz parte',
    example: '8c7b3b7d-1b1b-4b3b-8c7d-1b1b4b3b8c7d',
    format: 'uuid',
  })
  @IsOptional()
  @IsString({ message: 'O ID do grupo de usuários deve ser uma string.' })
  @IsUUID(4, { message: 'O ID do grupo de usuários deve ser um UUID v4.' })
  groupId?: string;

  @ApiPropertyOptional({
    description: 'ID do representante ao qual o usuário faz parte',
    example: '8c7b3b7d-1b1b-4b3b-8c7d-1b1b4b3b8c7d',
    format: 'uuid',
  })
  @IsOptional()
  @IsString({ message: 'O ID do representante deve ser uma string.' })
  @IsUUID(4, { message: 'O ID do representante deve ser um UUID v4.' })
  representativeId?: string;

  @ApiPropertyOptional({
    description: 'Perfil do usuário',
    type: UpdateUserProfileDto,
  })
  @IsOptional()
  @ValidateNested({ message: 'O perfil do usuário deve ser um objeto.' })
  @Type(() => UpdateUserProfileDto)
  profile: UpdateUserProfileDto;
}
