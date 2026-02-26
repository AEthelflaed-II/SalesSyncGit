import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { DocumentType } from '../interfaces/document-types.interfaces';
import { ListBase } from '@/infra/base/interfaces/pagination.interfaces';

export class ListDocumentsDto extends ListBase {
  @ApiPropertyOptional({
    description: 'Tipo do documento',
    example: DocumentType.IDENTITY,
    enum: DocumentType,
  })
  @IsOptional()
  @IsString({ message: 'O tipo do documento deve ser uma string.' })
  type?: DocumentType;

  @ApiPropertyOptional({
    description: 'Número do documento',
    example: '12345678910',
  })
  @IsOptional()
  @IsString({ message: 'O número do documento deve ser uma string.' })
  number?: string;

  @ApiPropertyOptional({
    description: 'ID do produto associado ao documento',
    example: '4d4b3b2b-3b2b-4b3b-2b3b-4b3b2b3b4b3b',
  })
  @IsOptional()
  @IsString({
    message: 'O ID do produto associado ao documento deve ser uma string.',
  })
  @IsUUID(4, {
    message: 'O ID do produto associado ao documento deve ser um UUIDv4.',
  })
  productId?: string;

  @ApiPropertyOptional({
    description: 'ID do pedido associado ao documento',
    example: '4d4b3b2b-3b2b-4b3b-2b3b-4b3b2b3b4b3b',
  })
  @IsOptional()
  @IsString({
    message: 'O ID do pedido associado ao documento deve ser uma string.',
  })
  @IsUUID(4, {
    message: 'O ID do pedido associado ao documento deve ser um UUIDv4.',
  })
  orderId?: string;

  @ApiPropertyOptional({
    description: 'ID do usuário associado ao documento',
    example: '4d4b3b2b-3b2b-4b3b-2b3b-4b3b2b3b4b3b',
  })
  @IsOptional()
  @IsString({
    message: 'O ID do usuário associado ao documento deve ser uma string.',
  })
  @IsUUID(4, {
    message: 'O ID do usuário associado ao documento deve ser um UUIDv4.',
  })
  userId?: string;
}
