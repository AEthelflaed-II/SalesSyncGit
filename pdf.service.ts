import { Injectable } from '@nestjs/common';
import type {
  DocumentInitParameters,
  PDFDocumentProxy,
} from 'pdfjs-dist/types/src/display/api';
import { dynamicImport } from '../import';

@Injectable()
export class PDFService {
  public OPS: typeof import('pdfjs-dist').OPS;
  private lib: typeof import('pdfjs-dist');
  async onModuleInit() {
    this.lib = await dynamicImport('pdfjs-dist/legacy/build/pdf.mjs');
    this.OPS = this.lib.OPS;
  }

  async getDocument(params: DocumentInitParameters): Promise<PDFDocumentProxy> {
    return this.lib.getDocument(params).promise;
  }
}
