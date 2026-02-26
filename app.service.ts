import { Injectable } from '@nestjs/common';
import { ConfigService } from '@/config/config.service';

@Injectable()
export class AppService {
  constructor(private readonly config: ConfigService) {}
  root() {
    return this.info();
  }

  info() {
    return {
      name: this.config.SERVICE_NAME,
      version: this.config.SERVICE_VERSION,
      description: this.config.SERVICE_DESCRIPTION,
      status: 'OK',
    };
  }
}
