import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { Exclude } from 'class-transformer';
import { PromiseReturnType } from '@/infra/types';
import { type StockProductRepository } from '@/infra/database/prisma/repositories/stock-product.repository';

export class CreateMedicalPrescriptionDto {
  @ApiProperty({
    description: 'Data da prescrição',
    example: '2021-01-01T00:00:00.000-03:00',
  })
  @IsNotEmpty({ message: 'Data da prescrição é obrigatória' })
  @IsString({ message: 'Data da prescrição deve ser uma string' })
  @IsDateString(
    { strict: true },
    { message: 'Data da prescrição deve ser uma data válida' },
  )
  prescriptionDate: string;

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
    example: 'Dr. João da Silva',
  })
  @IsNotEmpty({ message: 'Nome do médico é obrigatório' })
  @IsString({ message: 'Nome do médico deve ser uma string' })
  doctorName: string;

  @ApiProperty({
    description: 'CRM do médico',
    example: '1234567/SP',
  })
  @IsNotEmpty({ message: 'CRM do médico é obrigatório' })
  @IsString({ message: 'CRM do médico deve ser uma string' })
  doctorCRM: string;

  @ApiProperty({
    description: 'Nome do paciente',
    example: 'João da Silva',
  })
  @IsNotEmpty({ message: 'Nome do paciente é obrigatório' })
  @IsString({ message: 'Nome do paciente deve ser uma string' })
  patientName: string;

  @ApiPropertyOptional({
    description: 'Identificador do produto',
    example: '12345678-1234-1234-1234-123456789012',
  })
  @IsString({ message: 'Identificador do produto deve ser uma string' })
  @IsUUID(4, { message: 'Identificador do produto deve ser um UUIDv4' })
  productId?: string;

  @Exclude()
  product?: PromiseReturnType<StockProductRepository['findFirstByProductId']>;
}
