import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProcessDocumentService } from '@/app/document/services/process-document.service';
import { FileSizeValidationPipe } from '../validation/file-size.validation.pipe';
import { FileMimetypesValidationPipe } from '../validation/file-mimetypes.validation.pipe';
import { DocumentMimetype } from '@/app/document/interfaces/document-types.interfaces';

@ApiTags('Documentos')
@ApiBearerAuth()
@Controller('/documents/process')
export class ProcessDocumentController {
  constructor(private readonly processDocument: ProcessDocumentService) {}

  @Post()
  @ApiOperation({
    summary: 'Processar documento',
    description:
      'Processa um documento de imagem ou PDF e retorna dados estruturados específicos de acordo com cada tipo de documento.',
  })
  @UseInterceptors(FileInterceptor('file'))
  async handle(
    @UploadedFile(
      new FileSizeValidationPipe(1024 * 1024 * 5),
      new FileMimetypesValidationPipe([
        DocumentMimetype.JPEG,
        DocumentMimetype.PNG,
        DocumentMimetype.PDF,
      ]),
    )
    file: Express.Multer.File,
  ) {
    return this.processDocument.execute(
      file.buffer,
      file.mimetype as DocumentMimetype,
    );
  }
}
