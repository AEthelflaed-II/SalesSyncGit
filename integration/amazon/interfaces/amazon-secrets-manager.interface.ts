import { GetSecretValueCommandOutput } from '@aws-sdk/client-secrets-manager';
import type { ConfigService } from '@config/config.service';

export type SecureConfig = ConfigService;

export abstract class IAmazonSecretsManager {
  abstract getSecretValue(secretId: string): Promise<GetSecretValueCommandOutput>;
}
