import { Injectable } from '@nestjs/common';
import { NotFoundError } from '@/common/errors/not-found.error';
import { DocumentRepository } from '@/infra/database/prisma/repositories/document.repository';
import { AmazonCloudFrontService } from '@/infra/integration/amazon/services/amazon-cloudfront.service';
import { IActiveSession } from '@/app/session/interfaces/session.dto';
import { UserType } from '@/app/user/enums/user.enum';

@Injectable()
export class FindDocumentService {
  constructor(
    private readonly documentRepository: DocumentRepository,
    private readonly amazonCloudFront: AmazonCloudFrontService,
  ) {}

  async execute(session: IActiveSession, id: string) {
    const document = await this.documentRepository.findOne(id, {
      ...([UserType.CUSTOMER, UserType.DOCTOR].includes(
        session.user.group.type as UserType,
      ) && {
        userId: session.user.id,
      }),
    });

    if (!document) {
      throw new NotFoundError({
        module: 'Document',
        code: 'S.FDS.1',
        message: 'Documento não encontrado.',
      });
    }

    return {
      id: document.id,
      type: document.type,
      number: document.number,
      key: document.key,
      url: this.amazonCloudFront.getSignedUrl(document.key),
      ...document,
    };
  }
}
