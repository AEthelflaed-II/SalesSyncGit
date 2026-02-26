import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { AmazonSESService } from '../integration/amazon/services/amazon-ses.service';

@Module({
  providers: [EmailService, AmazonSESService],
  exports: [AmazonSESService],
})
export class EmailModule {}
