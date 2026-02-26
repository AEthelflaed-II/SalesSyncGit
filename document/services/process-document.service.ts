import { Injectable, Logger } from '@nestjs/common';
import { ApplicationError } from '@/common/errors/application.error';
import { NotAcceptableError } from '@/common/errors/not-acceptable.error';
import { ExtractDocumentTextService } from './extract-document-text.service';
import { ChatCompletionsService } from '@/infra/integration/openai/services/chat-completions.service';
import { GetCompletionMessagesService } from './get-completion-messages.service';
import { CategorizeDocumentService } from './categorize-document.service';
import { DocumentMimetype, DocumentType } from '../interfaces/document-types.interfaces';
import { ChatModel } from 'openai/resources';
import { getTools } from '../tools';

@Injectable()
export class ProcessDocumentService {
  private readonly modelName: ChatModel = 'gpt-4o';
  private readonly logger: Logger = new Logger(ProcessDocumentService.name);
  private readonly maxRetries = 3;

  constructor(
    private readonly extractDocumentText: ExtractDocumentTextService,
    private readonly chatCompletions: ChatCompletionsService,
    private readonly getCompletionMessages: GetCompletionMessagesService,
    private readonly categorizeDocument: CategorizeDocumentService,
  ) {}

  async execute(document: Buffer, mimetype: DocumentMimetype) {
    let retries = 0;

    const run = async () => {
      try {
        const data = await this.process(document, mimetype);
        return data;
      } catch (error) {
        if (error instanceof NotAcceptableError) {
          this.logger.error(error.message, error.stack);

          if (retries < this.maxRetries) {
            retries++;
            this.logger.warn(`Retrying process document. Retry ${retries}`);
            return run();
          } else {
            this.logger.warn(
              'Max retries reached.',
              'Processing document without automated validation.',
            );

            return this.process(document, mimetype, true);
          }
        } else if (
          error instanceof ApplicationError &&
          error.details?.type === DocumentType.OTHER
        ) {
          this.logger.error(error.message, error.stack);

          if (retries < this.maxRetries) {
            retries++;
            this.logger.warn(`Retrying process document. Retry ${retries}`);
            return run();
          } else {
            this.logger.warn('Max retries reached.');
            throw error;
          }
        }

        throw error;
      }
    };

    return run();
  }

  async process(
    document: Buffer,
    mimetype: DocumentMimetype,
    ignoreValidation: boolean = false,
  ) {
    try {
      const data = await this.extractDocumentText.execute(document, mimetype);
      const response = await this.chatCompletions.execute({
        model: this.modelName,
        messages: await Promise.all([
          this.getCompletionMessages.systemAnalyzerMessage(),
          this.getCompletionMessages.systemProductFetcherMessage(),
          this.getCompletionMessages.userDocumentMessage(document, mimetype),
          this.getCompletionMessages.userExtractedTextMessage(data),
          this.getCompletionMessages.systemMedicalDocumentMessage(),
        ]),
        tool_choice: 'required',
        tools: getTools(),
      });

      return this.categorizeDocument.execute(
        response.choices[0].message.tool_calls,
        ignoreValidation,
        data,
      );
    } catch (error) {
      throw new ApplicationError({
        module: 'Document',
        code: 'S.PDS.01',
        message: 'Erro ao processar o documento.',
        errors: [error],
      });
    }
  }
}
