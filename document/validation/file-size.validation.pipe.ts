import { PipeTransform, Injectable, HttpStatus } from '@nestjs/common';
import { ApplicationError } from '@/common/errors/application.error';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  constructor(private maxSize: number = 1024 * 1024) {}
  transform(value: Express.Multer.File) {
    if (!value) {
      throw new ApplicationError({
        module: 'Document',
        code: 'P.FSV.01',
        message: 'O arquivo é obrigatório.',
        status: HttpStatus.BAD_REQUEST,
        errors: [
          {
            property: 'file',
            messages: ['O envio do documento é obrigatório.'],
          } as unknown as Error,
        ],
      });
    }

    if (value.size > this.maxSize) {
      throw new ApplicationError({
        module: 'Document',
        code: 'P.FSV.02',
        message: 'O arquivo excede o tamanho máximo permitido.',
        status: HttpStatus.PAYLOAD_TOO_LARGE,
      });
    }

    return value;
  }
}
