import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadDocumentService } from '@/app/document/services/upload-document.service';
import { FileSizeValidationPipe } from '../validation/file-size.validation.pipe';
import { FileMimetypesValidationPipe } from '../validation/file-mimetypes.validation.pipe';
import { UploadDocumentRequestDto } from '../dtos/upload-document.request.dto';
import { DocumentMimetype } from '@/app/document/interfaces/document-types.interfaces';
import { ActiveSession } from '@/infra/decorators/base/active-session.decorator';
import { IActiveSession } from '@/app/session/interfaces/session.dto';

@ApiTags('Documentos')
@ApiBearerAuth()
@Controller('/documents/upload')
export class UploadDocumentController {
  constructor(private readonly uploadDocument: UploadDocumentService) {}

  @Post()
  @ApiOperation({
    summary: 'Enviar documento',
    description: 'Envia e salva um documento na plataforma.',
  })
  @UseInterceptors(FileInterceptor('file'))
  async handle(
    @ActiveSession() session: IActiveSession,
    @UploadedFile(
      new FileSizeValidationPipe(1024 * 1024 * 5),
      new FileMimetypesValidationPipe([
        DocumentMimetype.JPEG,
        DocumentMimetype.PNG,
        DocumentMimetype.PDF,
      ]),
    )
    file: Express.Multer.File,
    @Body() { userId }: UploadDocumentRequestDto,
  ) {
    return this.uploadDocument.execute(session, userId, file);
  }
}
