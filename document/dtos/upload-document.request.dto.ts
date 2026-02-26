import { Exclude } from 'class-transformer';
import { IsUUID } from 'class-validator';

export class UploadDocumentRequestDto {
  @IsUUID(4, { message: 'Identificador do usuário deve ser um UUIDv4.' })
  userId: string;

  @Exclude()
  file?: Express.Multer.File;
}
