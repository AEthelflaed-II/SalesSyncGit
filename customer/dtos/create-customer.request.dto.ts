import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateUserDto } from '@/app/user/dtos/create-user.dto';
import { CreateSimplifiedUserRequestDto } from '@/api/user/dtos/create-simplified-user.request.dto';
import { ParseUppercase } from '@/infra/decorators/validation/parse-uppercase.decorator';
import { ParseLowercase } from '@/infra/decorators/validation/parse-lowercase.decorator';
import { IsCPF } from '@/infra/decorators/validation/is-cpf.decorator';
import { removeDocumentMask } from '@/common/utils/document';

export class CreateCustomerRequestDto extends CreateSimplifiedUserRequestDto {
  @ApiProperty({
    description: 'ID do representante',
    example: '12345678-1234-1234-1234-123456789012',
  })
  @IsNotEmpty({ message: 'O ID do representante é obrigatório.' })
  @IsString({ message: 'O ID do representante deve ser uma string.' })
  @IsUUID(4, { message: 'O ID do representante deve ser um UUIDv4 válido.' })
  representativeId: string;

  @ApiProperty({
    description: 'Nome do cliente',
    example: 'JOÃO DA SILVA',
  })
  @IsNotEmpty({ message: 'O nome do cliente é obrigatório.' })
  @IsString({ message: 'O nome do cliente deve ser uma string.' })
  @ParseUppercase()
  fullName: string;

  @ApiProperty({
    description: 'CPF do cliente (com ou sem pontuação)',
    example: '123.456.789-10',
  })
  @IsNotEmpty({ message: 'O CPF do cliente é obrigatório.' })
  @IsString({ message: 'O CPF do cliente deve ser uma string.' })
  @IsCPF({ message: 'O CPF do cliente deve ser um CPF válido.' })
  @Transform(({ value }) => removeDocumentMask(value))
  document: string;

  @ApiProperty({
    description: 'E-mail do cliente',
    example: 'joaodasilva@email.com',
  })
  @IsNotEmpty({ message: 'O e-mail do cliente é obrigatório.' })
  @IsString({ message: 'O e-mail do cliente deve ser uma string.' })
  @IsEmail({}, { message: 'O e-mail do cliente deve ser um e-mail válido.' })
  @ParseLowercase()
  email: string;

  @ApiPropertyOptional({
    description: 'Telefone do cliente',
    example: '+5583999999999',
  })
  @IsOptional()
  @IsString({ message: 'O telefone do cliente deve ser uma string.' })
  @IsPhoneNumber('BR', {
    message: 'O telefone do cliente deve ser um telefone válido.',
  })
  phone?: string;

  toCreate(): CreateUserDto {
    return {
      document: this.document,
      password: '',
      groupId: '',
      representativeId: this.representativeId,
      profile: {
        firstName: this.getFirstName(),
        lastName: this.getLastName(),
        email: this.email,
        phone: this.phone,
      },
    };
  }
}
