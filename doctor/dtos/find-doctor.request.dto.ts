import { IsNotEmpty, IsString, IsUppercase, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindDoctorRequestParams {
  @ApiProperty({
    description: 'Número CRM do médico',
    example: '123456',
  })
  @IsNotEmpty({ message: 'Número CRM do médico é obrigatório' })
  @IsString({ message: 'Número CRM do médico deve ser uma string' })
  crmNumber: string;

  @ApiProperty({
    description: 'Estado do CRM do médico',
    example: 'PB',
  })
  @IsNotEmpty({ message: 'Estado do CRM do médico é obrigatório' })
  @Length(2, 2, { message: 'Estado do CRM do médico deve ter 2 caracteres' })
  @IsUppercase({ message: 'Estado do CRM do médico deve ser em maiúsculo' })
  @IsString({ message: 'Estado do CRM do médico deve ser uma string' })
  crmState: string;
}
