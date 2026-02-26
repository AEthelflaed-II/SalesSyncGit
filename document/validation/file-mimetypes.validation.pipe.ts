import { PipeTransform, Injectable, HttpStatus } from '@nestjs/common';
import { ApplicationError } from '@/common/errors/application.error';

@Injectable()
export class FileMimetypesValidationPipe implements PipeTransform {
  constructor(private allowedMimetypes: string[]) {}
  transform(value: Express.Multer.File) {
    if (!this.allowedMimetypes.includes(value.mimetype)) {
      throw new ApplicationError({
        module: 'Document',
        code: 'P.FMV.01',
        message: 'O arquivo não é permitido.',
        status: HttpStatus.PAYLOAD_TOO_LARGE,
        details: {
          message: 'Arquivos permitidos: ' + this.allowedMimetypes.join(', '),
        },
      });
    }

    return value;
  }
}
