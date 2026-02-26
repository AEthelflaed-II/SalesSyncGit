import { Injectable } from '@nestjs/common';
import { AmazonService } from '../amazon.service';
import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';
import {
  IAmazonSecretsManager,
  SecureConfig,
} from '../interfaces/amazon-secrets-manager.interface';
import { ConfigService as NestConfigService } from '@nestjs/config';
import type { ConfigService } from '@/config/config.service';

@Injectable()
export class AmazonSecretsManagerService
  extends AmazonService
  implements IAmazonSecretsManager
{
  private readonly client: SecretsManagerClient = new SecretsManagerClient(this.settings);
  constructor(private readonly config: NestConfigService) {
    super({
      AWS_REGION: config.get<string>('AWS_REGION'),
      AWS_ACCESS_KEY_ID: config.get<string>('AWS_ACCESS_KEY_ID'),
      AWS_SECRET_ACCESS_KEY: config.get<string>('AWS_SECRET_ACCESS_KEY'),
    } as ConfigService);
  }

  getSecretValue(secretId: string) {
    const command = new GetSecretValueCommand({
      SecretId: secretId,
    });

    return this.client.send(command);
  }

  parseSecret(secret: string): SecureConfig {
    return JSON.parse(secret);
  }
}
