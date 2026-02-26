import { Injectable } from '@nestjs/common';
import { AmazonService } from '../amazon.service';
import { ConfigService } from '@/config/config.service';
import {
  CreateBucketCommand,
  DeleteObjectCommand,
  GetBucketAclCommand,
  GetObjectCommand,
  ListBucketsCommand,
  ListObjectsCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class AmazonS3Service extends AmazonService {
  private readonly client: S3Client = new S3Client(this.settings);
  private readonly bucket: string = this.config.AWS_BUCKET_NAME;
  constructor(private readonly config: ConfigService) {
    super(config);
  }

  async onModuleInit() {
    const response = await this.listBuckets();
    if (!response || response.$metadata.httpStatusCode !== 200) {
      this.logger.error('Ocorreu um erro ao listar os buckets');
      return;
    }

    if (!response.Buckets.find((bucket) => bucket.Name === this.bucket)) {
      try {
        await this.createBucket();
        this.logger.log('Bucket criado com sucesso');
      } catch (error) {
        this.logger.error('Erro ao criar bucket');
        this.logger.error(error);
      }
    }
  }

  async getBucket() {
    const command: GetBucketAclCommand = new GetBucketAclCommand({
      Bucket: this.bucket,
    });

    return this.client.send(command);
  }

  async listBuckets() {
    const command: ListBucketsCommand = new ListBucketsCommand({
      BucketRegion: this.region,
      Prefix: this.bucket,
    });

    return this.client.send(command);
  }

  async createBucket() {
    const command: CreateBucketCommand = new CreateBucketCommand({
      Bucket: this.bucket,
    });

    return this.client.send(command);
  }

  async putObject(
    key: string,
    data: Buffer,
    options: { bucket?: string; contentType?: string } = {
      bucket: this.bucket,
      contentType: 'application/octet-stream',
    },
  ) {
    const command: PutObjectCommand = new PutObjectCommand({
      Bucket: options.bucket || this.bucket,
      Key: key,
      Body: data,
      ContentLength: data.byteLength,
      ContentType: options.contentType || 'application/octet-stream',
    });

    return this.client.send(command);
  }

  async getObject(key: string, bucket?: string) {
    const command: GetObjectCommand = new GetObjectCommand({
      Bucket: bucket || this.bucket,
      Key: key,
    });

    return this.client.send(command);
  }

  async deleteObject(key: string, bucket?: string) {
    const command: DeleteObjectCommand = new DeleteObjectCommand({
      Bucket: bucket || this.bucket,
      Key: key,
    });

    return this.client.send(command);
  }

  async listObjects(bucket?: string) {
    const command: ListObjectsCommand = new ListObjectsCommand({
      Bucket: bucket || this.bucket,
    });

    return this.client.send(command);
  }

  async getSignedUrl(
    key: string,
    options: { bucket: string; expiresIn: number } = {
      bucket: this.bucket,
      expiresIn: 24 * 60 * 60,
    },
  ) {
    return getSignedUrl(
      this.client,
      new GetObjectCommand({ Bucket: options.bucket, Key: key }),
      {
        expiresIn: options.expiresIn,
      },
    );
  }

  generateKey(prefix: string, key: string) {
    return `${prefix}/${key}`;
  }
}
