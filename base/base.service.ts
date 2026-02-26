import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class BaseService {
  public logger: Logger;
  constructor() {
    this.logger = new Logger(this.constructor.name);
  }
}
