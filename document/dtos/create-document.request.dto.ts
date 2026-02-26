import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { Document, DocumentMetadata } from '@/app/document/dtos/document.dto';
import { CreateDocumentDto } from '@/app/document/dtos/create-document.dto';
import { DocumentType } from '@/app/document/interfaces/document-types.interfaces';
import { Exclude } from 'class-transformer';

export class DocumentData<T extends DocumentMetadata = DocumentMetadata> {
  @ApiPropertyOptional({
    description: 'ID do usuário',
    example: '4d4b3b2b-3b2b-4b3b-2b3b-4b3b2b3b4b3b',
  })
  @IsOptional()
  @IsString({ message: 'O ID do usuário deve ser uma string.' })
  @IsUUID(4, { message: 'O ID do usuário deve ser um UUIDv4.' })
  userId?: string;

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

export class CreateDocumentRequestDto<
  T extends DocumentMetadata = DocumentMetadata,
> extends Document<DocumentType, any> {
  @ApiProperty({
    description: 'Dados para criação do documento',
    example: {
      userId: '4d4b3b2b-3b2b-4b3b-2b3b-4b3b2b3b4b3b',
      orderId: '4d4b3b2b-3b2b-4b3b-2b3b-4b3b2b3b4b3b',
      metadata: {
        personName: 'João da Silva',
        personCPF: '12345678901',
        birthDate: '1990-01-01T00:00:00.000-03:00',
      },
    },
  })
  data: DocumentData<T>;

  @Exclude()
  file?: Express.Multer.File;

  toCreate(): CreateDocumentDto<T> {
    return {
      type: this.type,
      holder: this.holder,
      key: '',
      userId: this.data?.userId,
      orderId: this.data?.orderId,
      metadata: this.data?.metadata,
    };
  }
}
