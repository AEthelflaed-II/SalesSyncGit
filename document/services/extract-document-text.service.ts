import { Injectable, Logger } from '@nestjs/common';
import { ApplicationError } from '@/common/errors/application.error';
import { Block, UnsupportedDocumentException } from '@aws-sdk/client-textract';
import { AmazonTextractService } from '@/infra/integration/amazon/services/amazon-textract.service';
import { DocumentMimetype } from '../interfaces/document-types.interfaces';
import { PDFService } from '@/shared/lib/pdf/pdf.service';
import { TextItem, VerbosityLevel } from '@/shared/lib/pdf/pdf.interfaces';

@Injectable()
export class ExtractDocumentTextService {
  private readonly logger: Logger = new Logger(ExtractDocumentTextService.name);
  constructor(
    private readonly pdfjs: PDFService,
    private readonly amazonTextract: AmazonTextractService,
  ) {}

  async execute(document: Buffer, mimetype: DocumentMimetype): Promise<string> {
    try {
      const text = await this.extractTextFromImage(document);
      return text;
    } catch (error) {
      if (error instanceof ApplicationError) {
        throw error;
      }

      throw new ApplicationError({
        module: 'Document',
        code: 'S.EDT.01',
        message: 'Erro ao extrair o texto no documento.',
        details: {
          mimetype,
        },
        errors: [error],
      });
    }
  }

  async extractTextFromImage(document: Buffer): Promise<string> {
    try {
      const response = await this.amazonTextract.detectText(document);
      return this.getDataFromBlocks(response.Blocks);
    } catch (error) {
      if (error instanceof UnsupportedDocumentException) {
        if (await this.isPDFTextBased(document)) {
          return this.extractTextFromPDF(document);
        }

        this.logger.warn('Documento não suportado pelo Amazon Textract.');
        this.logger.warn('Tentando extrair os dados de forma assíncrona.');

        const response = await this.amazonTextract.detectTextAsync(document);
        return this.getDataFromBlocks(response.Blocks);
      }

      this.logger.error('Erro ao extrair o texto no documento.', error);
      throw new ApplicationError({
        module: 'Document',
        code: 'S.EDT.02',
        message: 'Erro ao extrair o texto no documento.',
        errors: [error],
      });
    }
  }

  async extractTextFromPDF(document: Buffer): Promise<string> {
    const bytes = new Uint8Array(document);
    const pdf = await this.pdfjs.getDocument({
      data: bytes,
      verbosity: VerbosityLevel.ERRORS,
    });

    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item: TextItem) => item.str).join(' ');
    }

    return text;
  }

  async isPDFTextBased(document: Buffer): Promise<boolean> {
    const bytes = new Uint8Array(document);
    const pdf = await this.pdfjs.getDocument({
      data: bytes,
      verbosity: VerbosityLevel.ERRORS,
    });

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      if (content.items.length > 0) {
        return true;
      }
    }

    return false;
  }

  getDataFromBlocks(blocks: Block[]): string {
    let data: string = '';
    data += this.addSpecificData([this.getCPF(blocks)]);
    blocks?.forEach((block) => {
      if (block.BlockType === 'LINE') {
        data += block.Text + ' ';
      }
    });

    return data;
  }

  addSpecificData(data: string[]): string {
    return data.join(' ');
  }

  getCPF(blocks: Block[]): string {
    const accuracy = 0.02;

    /* CPF para CNH Digital */
    const cpfBlock = blocks.find((b) => ['CPF', '4d CPF'].includes(b.Text));
    if (!cpfBlock) {
      return '';
    }

    const { Top, Left, Width } = cpfBlock.Geometry.BoundingBox;
    const valueBlock = blocks.find(
      (b) =>
        b.Text?.match(/\d{3}\.\d{3}\.\d{3}-\d{2}/) &&
        b.Geometry.BoundingBox.Top > Top &&
        b.Geometry.BoundingBox.Left >= Left - accuracy &&
        b.Geometry.BoundingBox.Left <= Left + Width + accuracy,
    );

    if (!valueBlock) {
      return '';
    }

    return 'CPF ' + valueBlock.Text;
  }
}
