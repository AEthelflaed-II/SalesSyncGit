import { DocumentType } from '../interfaces/document-types.interfaces';
import {
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class UpdateDocumentDto<T> {
  @IsOptional()
  @IsString({ message: 'O tipo do documento deve ser uma string.' })
  @IsEnum(DocumentType, { message: 'O tipo do documento deve ser válido.' })
  type: DocumentType;

  @IsOptional()
  @IsString({ message: 'A chave do documento deve ser uma string.' })
  key: string;

  @IsOptional()
  @IsString({ message: 'O ID do usuário deve ser uma string.' })
  @IsUUID(4, { message: 'O ID do usuário deve ser um UUIDv4.' })
  userId: string;

  @IsOptional()
  @IsString({ message: 'O ID do pedido deve ser uma string.' })
  @IsUUID(4, { message: 'O ID do pedido deve ser um UUIDv4.' })
  orderId?: string;

  @IsOptional()
  @IsObject({ message: 'Os metadados do documento devem ser um objeto.' })
  metadata: T;
}
