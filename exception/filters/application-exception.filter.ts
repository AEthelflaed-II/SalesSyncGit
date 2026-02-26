import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { HttpExceptionError } from '@/common/errors/http-exception.error';
import { Response } from 'express';

@Catch(HttpExceptionError)
export class ApplicationExceptionFilter implements ExceptionFilter {
  catch(exception: HttpExceptionError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    return response.status(exception.status).json({
      name: exception.name,
      module: exception.module,
      code: exception.code,
      message: exception.message,
      status: exception.status,
      ...exception,
    });
  }
}
