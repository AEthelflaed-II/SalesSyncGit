import { ListBase } from '@/infra/base/interfaces/pagination.interfaces';
import { ParseBoolean } from '@/infra/decorators/validation/parse-boolean.decorator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { UserStatus, UserType } from '../enums/user.enum';

export class ListUsersDto extends ListBase {
  @ApiPropertyOptional({
    description: 'Tipo de usuário',
    example: UserType.CUSTOMER,
    enum: UserType,
  })
  @IsOptional()
  @IsString({ message: 'O tipo de usuário deve ser uma string.' })
  @IsEnum(UserType, { message: 'O tipo de usuário deve ser um valor válido.' })
  type?: UserType;

  @ApiPropertyOptional({
    description: 'Primeiro nome do usuário',
    example: 'João',
  })
  @IsOptional()
  @IsString({ message: 'O primeiro nome do usuário deve ser uma string.' })
  firstName?: string;

  @ApiPropertyOptional({
    description: 'Sobrenome do usuário',
    example: 'da Silva',
  })
  @IsOptional()
  @IsString({ message: 'O sobrenome do usuário deve ser uma string.' })
  lastName?: string;

  @ApiPropertyOptional({
    description: 'E-mail do usuário',
    example: 'joaodasilva@email.com',
  })
  @IsOptional()
  @IsString({ message: 'O e-mail do usuário deve ser uma string.' })
  email?: string;

  @ApiPropertyOptional({
    description: 'Status do usuário',
    example: UserStatus.PENDING_DOCUMENTS,
    enum: UserStatus,
  })
  @IsOptional()
  @IsString({ message: 'O status do usuário deve ser uma string.' })
  status?: string;

  @ApiPropertyOptional({
    description: 'Situação do usuário no sistema',
    example: true,
    type: Boolean,
  })
  @IsOptional()
  @ParseBoolean()
  @IsBoolean({ message: 'A situação do usuário deve ser um booleano.' })
  active?: boolean;
}
