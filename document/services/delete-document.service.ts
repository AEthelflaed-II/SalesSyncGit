import { Injectable } from '@nestjs/common';
import { NotFoundError } from '@/common/errors/not-found.error';
import { UnauthorizedError } from '@/common/errors/unauthorized.error';
import { DocumentRepository } from '@/infra/database/prisma/repositories/document.repository';
import { AmazonS3Service } from '@/infra/integration/amazon/services/amazon-s3.service';
import { IActiveSession } from '@/app/session/interfaces/session.dto';
import { UserType } from '@/app/user/enums/user.enum';

@Injectable()
export class DeleteDocumentService {
  constructor(
    private readonly amazonS3: AmazonS3Service,
    private readonly documentRepository: DocumentRepository,
  ) {}
  async execute(session: IActiveSession, id: string) {
    const document = await this.documentRepository.findOne(id);
    if (!document) {
      throw new NotFoundError({
        module: 'Document',
        code: 'S.DDS.1',
        message: 'Documento não encontrado',
      });
    } else if (
      ![UserType.ADMIN, UserType.EMPLOYEE].includes(
        session.user.group.type as UserType,
      )
    ) {
      throw new UnauthorizedError({
        module: 'Document',
        code: 'S.DDS.2',
        message: 'Usuário não autorizado',
      });
    }

    await this.documentRepository.delete(id);
    await this.amazonS3.deleteObject(document.key);
  }
}
