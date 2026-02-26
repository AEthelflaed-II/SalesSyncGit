import { Controller, Delete, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeleteDocumentService } from '@/app/document/services/delete-document.service';
import { ResourceBaseParams } from '@/infra/base/interfaces/request-params.interfaces';
import { IActiveSession } from '@/app/session/interfaces/session.dto';
import { ActiveSession } from '@/infra/decorators/base/active-session.decorator';

@ApiTags('Documentos')
@ApiBearerAuth()
@Controller('/documents')
export class DeleteDocumentController {
  constructor(private readonly deleteDocument: DeleteDocumentService) {}

  @Delete('/:id')
  @ApiOperation({
    summary: 'Excluir documento',
    description: 'Exclui definitivamente um documento na plataforma.',
  })
  async handle(
    @ActiveSession() session: IActiveSession,
    @Param() { id }: ResourceBaseParams,
  ) {
    return this.deleteDocument.execute(session, id);
  }
}
