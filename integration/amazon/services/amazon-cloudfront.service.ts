import { Injectable } from '@nestjs/common';
import { ConfigService } from '@/config/config.service';
import { AmazonService } from '../amazon.service';
import { CloudFrontClient, CreateInvalidationCommand } from '@aws-sdk/client-cloudfront';
import { getSignedUrl } from '@aws-sdk/cloudfront-signer';

@Injectable()
export class AmazonCloudFrontService extends AmazonService {
  private readonly client: CloudFrontClient = new CloudFrontClient(this.settings);
  private readonly signUrlExpiration = 60 * 60;
  constructor(private readonly config: ConfigService) {
    super(config);
  }

  getSignedUrl(key: string): string {
    const signedUrl = getSignedUrl({
      keyPairId: this.config.AWS_CLOUDFRONT_KEY_PAIR_ID,
      privateKey: Buffer.from(
        this.config.AWS_CLOUDFRONT_PRIVATE_KEY,
        'base64',
      ).toString(),
      policy: JSON.stringify({
        Statement: [
          {
            Resource: `${this.config.AWS_CLOUDFRONT_URL}/${key}`,
            Condition: {
              DateLessThan: {
                'AWS:EpochTime': Math.floor(Date.now() / 1000) + this.signUrlExpiration,
              },
            },
          },
        ],
      }),
    });

    return signedUrl;
  }

  async invalidateCache(key: string): Promise<void> {
    const command = new CreateInvalidationCommand({
      DistributionId: this.config.AWS_CLOUDFRONT_DISTRIBUTION_ID,
      InvalidationBatch: {
        CallerReference: Date.now().toString(),
        Paths: {
          Quantity: 1,
          Items: [`/${key}`],
        },
      },
    });

    await this.client.send(command);
  }
}
