import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DocumentType } from '../interfaces/document-types.interfaces';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { DocumentMetadata } from './document.dto';

export class CreateDocumentDto<T extends DocumentMetadata = DocumentMetadata> {
  @ApiProperty({
    description: 'Tipo do documento',
    example: DocumentType.IDENTITY,
    enum: DocumentType,
  })
  @IsNotEmpty({ message: 'O tipo do documento é obrigatório.' })
  @IsString({ message: 'O tipo do documento deve ser uma string.' })
  @IsEnum(DocumentType, { message: 'O tipo do documento deve ser válido.' })
  type: DocumentType;

  @ApiProperty({
    description: 'Titular do documento',
    example: 'patient',
    enum: ['patient', 'guardian'],
  })
  @IsEnum(['patient', 'guardian'], {
    message: 'O titular do documento deve ser válido.',
  })
  @IsString({ message: 'O titular do documento deve ser uma string.' })
  holder: 'patient' | 'guardian' | 'unknown' = 'unknown';

  @ApiProperty({
    description: 'Chave do documento',
    example:
      'users/4c4b3b2b-3b2b-4b3b-2b3b-4b3b2b3b4b3b/documents/identity/179029833641.jpg',
  })
  @IsNotEmpty({ message: 'A chave do documento é obrigatória.' })
  @IsString({ message: 'A chave do documento deve ser uma string.' })
  key: string;

  @ApiProperty({
    description: 'ID do usuário',
    example: '4d4b3b2b-3b2b-4b3b-2b3b-4b3b2b3b4b3b',
  })
  @IsNotEmpty({ message: 'O ID do usuário é obrigatório.' })
  @IsString({ message: 'O ID do usuário deve ser uma string.' })
  @IsUUID(4, { message: 'O ID do usuário deve ser um UUIDv4.' })
  userId: string;

  @ApiPropertyOptional({
    description: 'ID do pedido',
    example: '4d4b3b2b-3b2b-4b3b-2b3b-4b3b2b3b4b3b',
  })
  @IsOptional()
  @IsString({ message: 'O ID do pedido deve ser uma string.' })
  @IsUUID(4, { message: 'O ID do pedido deve ser um UUIDv4.' })
  orderId?: string;

  @ApiProperty({
    description: 'Metadados do documento',
    example: {
      personName: 'João da Silva',
      personCPF: '12345678901',
      birthDate: '1990-01-01T00:00:00.000-03:00',
    },
  })
  @IsOptional()
  metadata: T;
}
