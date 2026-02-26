import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { OpenAIModule } from '@/infra/integration/openai/openai.module';
import { EnsureAuthMiddleware } from '../auth/middlewares/ensure-auth.middleware';
import { CreateDocumentController } from '@/api/document/controllers/create-document.controller';
import { FindDocumentController } from '@/api/document/controllers/find-document.controller';
import { ListDocumentsController } from '@/api/document/controllers/list-documents.controller';
import { DeleteDocumentController } from '@/api/document/controllers/delete-document.controller';
import { UploadDocumentController } from '@/api/document/controllers/upload-document.controller';
import { ProcessDocumentController } from '@/api/document/controllers/process-document.controller';
import { DocumentRepository } from '@/infra/database/prisma/repositories/document.repository';
import { ProductRepository } from '@/infra/database/prisma/repositories/product.repository';
import { UserRepository } from '@/infra/database/prisma/repositories/user.repository';
import { AmazonS3Service } from '@/infra/integration/amazon/services/amazon-s3.service';
import { AmazonTextractService } from '@/infra/integration/amazon/services/amazon-textract.service';
import { AmazonCloudFrontService } from '@/infra/integration/amazon/services/amazon-cloudfront.service';
import { CreateDocumentService } from './services/create-document.service';
import { FindDocumentService } from './services/find-document.service';
import { ListDocumentsService } from './services/list-documents.service';
import { DeleteDocumentService } from './services/delete-document.service';
import { UploadDocumentService } from './services/upload-document.service';
import { ProcessDocumentService } from './services/process-document.service';
import { ProcessAnalyzeDocumentService } from './services/process-analyzed-document.service';
import { ExtractDocumentTextService } from './services/extract-document-text.service';
import { CategorizeDocumentService } from './services/categorize-document.service';
import { ChatCompletionsService } from '@/infra/integration/openai/services/chat-completions.service';
import { GetCompletionMessagesService } from './services/get-completion-messages.service';
import { FindUserService } from '../user/services/find-user.service';
import { ListProductsService } from '../product/services/list-products.service';
import { StockProductRepository } from '@/infra/database/prisma/repositories/stock-product.repository';
import { FindStockProductService } from '../stock-product/services/find-stock-product.service';

@Module({
  imports: [OpenAIModule],
  controllers: [
    CreateDocumentController,
    FindDocumentController,
    ListDocumentsController,
    DeleteDocumentController,
    UploadDocumentController,
    ProcessDocumentController,
  ],
  providers: [
    DocumentRepository,
    StockProductRepository,
    AmazonS3Service,
    AmazonTextractService,
    AmazonCloudFrontService,
    ChatCompletionsService,
    GetCompletionMessagesService,
    CreateDocumentService,
    FindDocumentService,
    ListDocumentsService,
    DeleteDocumentService,
    UploadDocumentService,
    ProcessDocumentService,
    ProcessAnalyzeDocumentService,
    ExtractDocumentTextService,
    CategorizeDocumentService,
    ProductRepository,
    UserRepository,
    ListProductsService,
    FindStockProductService,
    FindUserService,
  ],
})
export class DocumentModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(EnsureAuthMiddleware)
      .forRoutes(
        CreateDocumentController,
        FindDocumentController,
        ListDocumentsController,
        DeleteDocumentController,
        UploadDocumentController,
        ProcessDocumentController,
      );
  }
}
