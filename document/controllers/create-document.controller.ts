import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateDocumentService } from '@/app/document/services/create-document.service';
import { FileSizeValidationPipe } from '../validation/file-size.validation.pipe';
import { FileMimetypesValidationPipe } from '../validation/file-mimetypes.validation.pipe';
import { CreateDocumentRequestDto } from '@/api/document/dtos/create-document.request.dto';
import { DocumentMimetype } from '@/app/document/interfaces/document-types.interfaces';
import { ActiveSession } from '@/infra/decorators/base/active-session.decorator';
import { IActiveSession } from '@/app/session/interfaces/session.dto';

@ApiTags('Documentos')
@ApiBearerAuth()
@Controller('/documents')
export class CreateDocumentController {
  constructor(private readonly createDocument: CreateDocumentService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar documento',
    description: 'Cria e salva um documento na plataforma.',
  })
  @UseInterceptors(FileInterceptor('file'))
  async handle(
    @ActiveSession() session: IActiveSession,
    @Body() data: CreateDocumentRequestDto,
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
    return this.createDocument.execute(session, data.toCreate(), file);
  }
}
