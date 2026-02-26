import { Injectable } from '@nestjs/common';
import { DocumentRepository } from '@/infra/database/prisma/repositories/document.repository';
import { AmazonCloudFrontService } from '@/infra/integration/amazon/services/amazon-cloudfront.service';
import { ListDocumentsDto } from '../dtos/list-documents.dto';
import { IActiveSession } from '@/app/session/interfaces/session.dto';
import { UserType } from '@/app/user/enums/user.enum';

@Injectable()
export class ListDocumentsService {
  constructor(
    private readonly documentRepository: DocumentRepository,
    private readonly amazonCloudFront: AmazonCloudFrontService,
  ) {}

  async execute(session: IActiveSession, options: ListDocumentsDto) {
    const documents = await this.documentRepository.list(options, {
      ...([UserType.CUSTOMER, UserType.DOCTOR].includes(
        session.user.group.type as UserType,
      ) && {
        userId: session.user.id,
      }),
    });

    return {
      ...documents,
      data: documents.data.map((document) => ({
        id: document.id,
        type: document.type,
        number: document.number,
        key: document.key,
        url: this.amazonCloudFront.getSignedUrl(document.key),
        ...document,
      })),
    };
  }
}
