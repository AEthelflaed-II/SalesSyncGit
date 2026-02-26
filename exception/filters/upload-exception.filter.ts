import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { MulterError } from 'multer';
import { Response } from 'express';

@Catch(MulterError)
export class UploadExceptionFilter implements ExceptionFilter {
  catch(exception: MulterError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();

    let message = 'Ocorreu um erro ao realizar o upload.';
    if (exception.code === 'LIMIT_FILE_SIZE') {
      message = 'O arquivo excede o tamanho máximo permitido.';
    }

    return response.status(HttpStatus.PAYLOAD_TOO_LARGE).json({
      name: exception.name,
      module: 'Upload',
      code: 'IN.UPLOAD.ERR',
      message: message,
      status: HttpStatus.PAYLOAD_TOO_LARGE,
      ...exception,
    });
  }
}
