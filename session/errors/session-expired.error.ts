import { HttpStatus } from '@nestjs/common';
import { ApplicationError } from '@/common/errors/application.error';

interface ISessionExpiredErrorOptions {
  module: string;
  code: string;
  message: string;
  status?: number;
  expiredAt: Date;
  logout?: boolean;
}

export class SessionExpiredError extends ApplicationError {
  public name: string = SessionExpiredError.name;
  public logout: boolean;
  public expiredAt: Date;

  constructor(options: ISessionExpiredErrorOptions) {
    super({
      module: options?.module,
      code: options?.code,
      message: options.message,
      status: options?.status ?? HttpStatus.UNAUTHORIZED,
    });

    this.expiredAt = options.expiredAt;
    this.logout = options?.logout;
  }
}
