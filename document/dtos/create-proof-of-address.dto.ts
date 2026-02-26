import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNotEmptyObject, IsString, ValidateNested } from 'class-validator';
import { Address } from './document.dto';

export class CreateProofOfAddressDto {
  @ApiProperty({
    description: 'Nome da pessoa',
    example: 'João da Silva',
  })
  @IsNotEmpty({ message: 'Nome da pessoa é obrigatório' })
  @IsString({ message: 'Nome da pessoa deve ser uma string' })
  personName: string;

  @ApiProperty({
    description: 'Endereço da pessoa',
    type: Address,
  })
  @IsNotEmptyObject({}, { message: 'O endereço da pessoa é obrigatório.' })
  @ValidateNested({ message: 'O endereço da pessoa deve ser um objeto.' })
  @Type(() => Address)
  address: Address;
}
