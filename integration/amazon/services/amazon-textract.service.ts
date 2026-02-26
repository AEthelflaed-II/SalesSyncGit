import { Injectable } from '@nestjs/common';
import { AmazonService } from '../amazon.service';
import { ConfigService } from '@/config/config.service';
import {
  DetectDocumentTextCommand,
  GetDocumentTextDetectionCommand,
  GetDocumentTextDetectionCommandOutput,
  StartDocumentTextDetectionCommand,
  TextractClient,
} from '@aws-sdk/client-textract';
import { AmazonS3Service } from './amazon-s3.service';
import { randomUUID } from 'crypto';

type TextractProcessingStatus = GetDocumentTextDetectionCommandOutput['JobStatus'];

@Injectable()
export class AmazonTextractService extends AmazonService {
  private readonly client: TextractClient = new TextractClient(this.settings);
  constructor(
    private readonly config: ConfigService,
    private readonly amazonS3: AmazonS3Service,
  ) {
    super(config);
  }

  async detectText(document: Buffer) {
    const command: DetectDocumentTextCommand = new DetectDocumentTextCommand({
      Document: {
        Bytes: document,
      },
    });

    return this.client.send(command);
  }

  async detectTextAsync(document: Buffer) {
    const temporaryKey = `textract/${randomUUID()}`;
    await this.amazonS3.putObject(temporaryKey, document);

    this.logger.log('Iniciando processamento do documento');
    const jobId = await this.startDocumentAnalysis(temporaryKey);
    const response = await this.getDocumentResults(jobId);

    await this.amazonS3.deleteObject(temporaryKey);
    return response;
  }

  async startDocumentAnalysis(key: string): Promise<string> {
    const command = new StartDocumentTextDetectionCommand({
      DocumentLocation: {
        S3Object: { Bucket: this.config.AWS_BUCKET_NAME, Name: key },
      },
    });

    const response = await this.client.send(command);
    return response.JobId;
  }

  async getDocumentResults(jobId: string) {
    let status: TextractProcessingStatus = 'IN_PROGRESS';
    while (status === 'IN_PROGRESS') {
      this.logger.log('Aguardando processamento do documento...');
      await new Promise((resolve) => setTimeout(resolve, 5000));

      const command = new GetDocumentTextDetectionCommand({ JobId: jobId });
      const response = await this.client.send(command);
      status = response.JobStatus;

      if (status === 'SUCCEEDED') {
        this.logger.log('Documento processado com sucesso');
        return response;
      } else if (status === 'PARTIAL_SUCCESS') {
        this.logger.warn('Processamento parcial do documento');
        return response;
      } else if (status === 'FAILED') {
        this.logger.error('Falha ao processar o documento: ' + response.StatusMessage);
        throw new Error('Falha ao processar o documento: ' + response.StatusMessage);
      }
    }
  }
}
