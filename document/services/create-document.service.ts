import { HttpStatus, Injectable } from '@nestjs/common';
import { ApplicationError } from '@/common/errors/application.error';
import { DocumentRepository } from '@/infra/database/prisma/repositories/document.repository';
import { UserRepository } from '@/infra/database/prisma/repositories/user.repository';
import { AmazonCloudFrontService } from '@/infra/integration/amazon/services/amazon-cloudfront.service';
import { AmazonS3Service } from '@/infra/integration/amazon/services/amazon-s3.service';
import { IActiveSession } from '@/app/session/interfaces/session.dto';
import { DocumentType } from '../interfaces/document-types.interfaces';
import { CreateDocumentDto } from '../dtos/create-document.dto';
import { CreateIdentityDto } from '../dtos/create-identity.dto';
import { CreateProofOfAddressDto } from '../dtos/create-proof-of-address.dto';
import { CreatePowerOfAttorneyDto } from '../dtos/create-power-of-attorney.dto';
import { CreateMedicalPrescriptionDto } from '../dtos/create-medical-prescription.dto';
import { CreateAnvisaAuthorizationDto } from '../dtos/create-anvisa-authorization.dto';
import { removeDocumentMask } from '@/common/utils/document';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import * as path from 'path';

type DocumentMap = {
  [DocumentType.IDENTITY]: [CreateIdentityDto, string];
  [DocumentType.PROOF_OF_ADDRESS]: [CreateProofOfAddressDto, string];
  [DocumentType.POWER_OF_ATTORNEY]: [CreatePowerOfAttorneyDto, string];
  [DocumentType.MEDICAL_PRESCRIPTION]: [CreateMedicalPrescriptionDto, string];
  [DocumentType.ANVISA_AUTHORIZATION]: [CreateAnvisaAuthorizationDto, string];
};

@Injectable()
export class CreateDocumentService {
  constructor(
    private readonly documentRepository: DocumentRepository,
    private readonly userRepository: UserRepository,
    private readonly amazonCloudFront: AmazonCloudFrontService,
    private readonly amazonS3: AmazonS3Service,
  ) {}

  async execute(
    session: IActiveSession,
    data: CreateDocumentDto,
    file: Express.Multer.File,
  ) {
    const user = await this.userRepository.findOne(data.userId);
    if (!user) {
      throw new ApplicationError({
        module: 'Document',
        code: 'S.CDS.01',
        message: 'Usuário portador do documento não encontrado.',
        status: HttpStatus.NOT_FOUND,
      });
    }

    if (!file) {
      throw new ApplicationError({
        module: 'Document',
        code: 'S.CDS.02',
        message: 'Documento obrigatório.',
        status: HttpStatus.BAD_REQUEST,
        errors: [
          {
            property: 'file',
            messages: ['O envio do documento é obrigatório.'],
          } as unknown as Error,
        ],
      });
    }

    await this.validateDocument(data);
    const key = this.amazonS3.generateKey(
      `users/${removeDocumentMask(user.document)}-${user.id}/documents/${data.type}`,
      new Date().getTime().toString() + path.extname(file.originalname),
    );

    await this.amazonS3.putObject(key, file.buffer, {
      contentType: file.mimetype,
    });

    const { id, type, holder, number, ...document } =
      await this.documentRepository.create({
        type: data.type,
        holder: data.holder,
        key,
        metadata: data.metadata,
        orderId: data.orderId,
        userId: data.userId,
      });

    return {
      id,
      type,
      holder,
      number,
      key,
      url: this.amazonCloudFront.getSignedUrl(key),
      ...document,
    };
  }

  private async validateDocument({ type, holder, metadata }: CreateDocumentDto) {
    if (!type) {
      throw new ApplicationError({
        module: 'Document',
        code: 'S.CDS.03',
        message: 'Tipo de documento obrigatório.',
        status: HttpStatus.BAD_REQUEST,
        errors: [
          {
            property: 'type',
            messages: ['O tipo do documento é obrigatório.'],
          } as unknown as Error,
        ],
      });
    } else if (!metadata) {
      throw new ApplicationError({
        module: 'Document',
        code: 'S.CDS.04',
        message: 'Metadados obrigatórios.',
        status: HttpStatus.BAD_REQUEST,
        errors: [
          {
            property: 'data.metadata',
            messages: ['Os metadados do documento são obrigatórios.'],
          } as unknown as Error,
        ],
      });
    } else if (type === DocumentType.POWER_OF_ATTORNEY || holder === 'guardian') {
      return;
    }

    const documentMap: DocumentMap = {
      [DocumentType.IDENTITY]: [
        plainToClass(CreateIdentityDto, metadata),
        'Erro ao criar documento de identidade.',
      ],
      [DocumentType.PROOF_OF_ADDRESS]: [
        plainToClass(CreateProofOfAddressDto, metadata),
        'Erro ao criar comprovante de residência.',
      ],
      [DocumentType.POWER_OF_ATTORNEY]: [
        plainToClass(CreatePowerOfAttorneyDto, metadata),
        'Erro ao criar procuração.',
      ],
      [DocumentType.MEDICAL_PRESCRIPTION]: [
        plainToClass(CreateMedicalPrescriptionDto, metadata),
        'Erro ao criar receita médica.',
      ],
      [DocumentType.ANVISA_AUTHORIZATION]: [
        plainToClass(CreateAnvisaAuthorizationDto, metadata),
        'Erro ao criar autorização da Anvisa.',
      ],
    };

    const document = documentMap[type];
    if (!document[0]) {
      throw new ApplicationError({
        module: 'Document',
        code: 'S.CDS.03',
        message: 'Tipo de documento não encontrado.',
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return ApplicationError.validate(await validate(document[0]), 'data.metadata');
  }
}
