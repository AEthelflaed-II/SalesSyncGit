import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@/config/config.service';
import { AWSSettings, AWSCredentials } from './dtos/settings.dto';

@Injectable()
export class AmazonService {
  protected readonly logger: Logger;
  protected readonly region: string;
  protected readonly settings: AWSSettings;
  constructor(
    config: ConfigService,
    private readonly name?: string,
  ) {
    this.logger = new Logger(this.name || AmazonService.name);
    this.region = config.AWS_REGION;
    this.settings = new AWSSettings(
      this.region,
      new AWSCredentials(config.AWS_ACCESS_KEY_ID, config.AWS_SECRET_ACCESS_KEY),
    );
  }
}
