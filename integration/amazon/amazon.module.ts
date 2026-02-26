import { Module } from '@nestjs/common';
import { AmazonS3Service } from './services/amazon-s3.service';
import { AmazonSESService } from './services/amazon-ses.service';
import { AmazonTextractService } from './services/amazon-textract.service';
import { AmazonSecretsManagerService } from './services/amazon-secrets-manager.service';
import { AmazonCloudFrontService } from './services/amazon-cloudfront.service';

@Module({
  providers: [
    AmazonS3Service,
    AmazonSESService,
    AmazonTextractService,
    AmazonSecretsManagerService,
    AmazonCloudFrontService,
  ],
})
export class AmazonModule {}
