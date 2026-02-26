import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FindDocumentService } from '@/app/document/services/find-document.service';
import { ActiveSession } from '@/infra/decorators/base/active-session.decorator';
import { IActiveSession } from '@/app/session/interfaces/session.dto';
import { ResourceBaseParams } from '@/infra/base/interfaces/request-params.interfaces';

@ApiTags('Documentos')
@ApiBearerAuth()
@Controller('/documents')
export class FindDocumentController {
  constructor(private readonly findDocument: FindDocumentService) {}

  @Get('/find/:id')
  @ApiOperation({
    summary: 'Buscar documento',
    description: 'Buscar documento pelo ID.',
  })
  async handle(
    @ActiveSession() session: IActiveSession,
    @Param() { id }: ResourceBaseParams,
  ) {
    return this.findDocument.execute(session, id);
  }
}
