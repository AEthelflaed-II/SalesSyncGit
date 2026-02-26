import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateSimplifiedUserRequestDto } from '@/api/user/dtos/create-simplified-user.request.dto';
import { ParseUppercase } from '@/infra/decorators/validation/parse-uppercase.decorator';

export class CreateDoctorRequestDto extends CreateSimplifiedUserRequestDto {
  @ApiProperty({
    description: 'Nome do médico',
    example: 'DR. JOÃO DA SILVA',
  })
  @IsNotEmpty({ message: 'O nome do médico é obrigatório.' })
  @IsString({ message: 'O nome do médico deve ser uma string.' })
  @ParseUppercase()
  fullName: string;

  @ApiProperty({
    description: 'CRM do médico',
    example: '12345/SP',
  })
  @IsNotEmpty({ message: 'O CRM do médico é obrigatório.' })
  @IsString({ message: 'O CRM do médico deve ser uma string.' })
  @Matches(/^\d{2,7}(-[A-Z])?\/[A-Z]{2}$/, {
    message: 'O CRM do médico deve ser no formato 12345/SP.',
  })
  document: string;
}
