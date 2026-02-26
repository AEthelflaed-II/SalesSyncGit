import { HttpStatus, Injectable } from '@nestjs/common';
import { ApplicationError } from '@/common/errors/application.error';
import { AmazonS3Service } from '@/infra/integration/amazon/services/amazon-s3.service';
import { IActiveSession } from '@/app/session/interfaces/session.dto';
import * as path from 'path';

@Injectable()
export class UploadDocumentService {
  constructor(private readonly amazonS3: AmazonS3Service) {}

  async execute(session: IActiveSession, userId: string, document: Express.Multer.File) {
    if (!document) {
      throw new ApplicationError({
        module: 'Document',
        code: 'S.UPD.01',
        message: 'Documento obrigatório.',
        status: HttpStatus.BAD_REQUEST,
        errors: [
          {
            property: 'file',
            messages: ['O envio do documento é obrigatório.'],
          } as unknown as Error,
        ],
      });
    }

    try {
      const key = this.amazonS3.generateKey(
        `users/${session.user.document}-${userId}/documents`,
        new Date().getTime().toString() + path.extname(document.originalname),
      );

      return this.amazonS3.putObject(key, document.buffer, {
        contentType: document.mimetype,
      });
    } catch (error) {
      throw new ApplicationError({
        module: 'Document',
        code: 'S.UPD.02',
        message: 'Erro ao enviar documento.',
        errors: [error],
      });
    }
  }
}
