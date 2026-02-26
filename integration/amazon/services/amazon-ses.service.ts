import { Injectable } from '@nestjs/common';
import { AmazonService } from '../amazon.service';
import { ConfigService } from '@/config/config.service';
import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';

@Injectable()
export class AmazonSESService extends AmazonService {
  private readonly client: SESClient = new SESClient(this.settings);
  constructor(private readonly config: ConfigService) {
    super(config);
  }

  async sendEmail({
    from,
    to,
    subject,
    html,
  }: {
    from: string;
    to: string[];
    subject: string;
    html: string;
  }) {
    const command = new SendEmailCommand({
      Source: from,
      Destination: {
        ToAddresses: to,
      },
      Message: {
        Subject: {
          Data: subject,
        },
        Body: {
          Html: {
            Data: html,
          },
        },
      },
    });

    return this.client.send(command);
  }
}
