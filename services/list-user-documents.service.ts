import { Injectable } from '@nestjs/common';
import { ListDocumentsService } from '@/app/document/services/list-documents.service';
import { ListUserDocumentsDto } from './dtos/list-user-documents.dto';
import { IActiveSession } from '@/app/session/interfaces/session.dto';

@Injectable()
export class ListUserDocumentsService {
  constructor(private readonly listDocuments: ListDocumentsService) {}

  async execute(session: IActiveSession, filters: ListUserDocumentsDto) {
    return this.listDocuments.execute(session, filters);
  }
}
