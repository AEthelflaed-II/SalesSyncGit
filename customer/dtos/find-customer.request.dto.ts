import { IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsCPF } from '@/infra/decorators/validation/is-cpf.decorator';
import { removeDocumentMask } from '@/common/utils/document';

export class FindCustomerRequestParams {
  @ApiProperty({
    description: 'CPF do cliente',
    example: '123.456.789-00',
  })
  @IsCPF({ message: 'CPF do cliente deve ser válido' })
  @IsNotEmpty({ message: 'CPF do cliente é obrigatório' })
  @IsString({ message: 'CPF do cliente deve ser uma string' })
  @Transform(({ value }) => removeDocumentMask(value))
  cpf: string;
}
