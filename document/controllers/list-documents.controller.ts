import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ListDocumentsService } from '@/app/document/services/list-documents.service';
import { ListDocumentsDto } from '@/app/document/dtos/list-documents.dto';
import { ActiveSession } from '@/infra/decorators/base/active-session.decorator';
import { IActiveSession } from '@/app/session/interfaces/session.dto';

@ApiTags('Documentos')
@ApiBearerAuth()
@Controller('/documents')
export class ListDocumentsController {
  constructor(private readonly listDocuments: ListDocumentsService) {}

  @Get('/all')
  @ApiOperation({
    summary: 'Listar documentos',
    description:
      'Listar documentos com filtros opcionais. Caso o usuário que esteja filtrando seja do tipo "cliente", será retornado apenas os documentos relacionados a ele.',
  })
  async handle(
    @ActiveSession() session: IActiveSession,
    @Query() filters: ListDocumentsDto,
  ) {
    return this.listDocuments.execute(session, filters);
  }
}
