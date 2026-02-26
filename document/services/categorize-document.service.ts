import { Injectable, Logger } from '@nestjs/common';
import { ApplicationError } from '@/common/errors/application.error';
import { NotAcceptableError } from '@/common/errors/not-acceptable.error';
import { FindUserService } from '@/app/user/services/find-user.service';
import { FindStockProductService } from '@/app/stock-product/services/find-stock-product.service';
import { CreateIdentityDto } from '../dtos/create-identity.dto';
import { CreateProofOfAddressDto } from '../dtos/create-proof-of-address.dto';
import { CreatePowerOfAttorneyDto } from '../dtos/create-power-of-attorney.dto';
import { CreateMedicalPrescriptionDto } from '../dtos/create-medical-prescription.dto';
import { CreateAnvisaAuthorizationDto } from '../dtos/create-anvisa-authorization.dto';
import { ChatCompletionMessageToolCall } from 'openai/resources';
import { DocumentType } from '../interfaces/document-types.interfaces';
import { Document } from '../dtos/document.dto';
import {
  removeDocumentMask,
  validateCPF,
  validateCRM,
  validateAuthorizationNumber,
  normalizeAuthorizationNumber,
  normalizeCRM,
} from '@/common/utils/document';

@Injectable()
export class CategorizeDocumentService {
  private readonly logger: Logger = new Logger(CategorizeDocumentService.name);
  constructor(
    private readonly findUser: FindUserService,
    private readonly findStockProduct: FindStockProductService,
  ) {}

  async execute(
    data: ChatCompletionMessageToolCall[],
    ignoreValidation: boolean = false,
    extractedText: string,
  ): Promise<any> {
    try {
      const toolCall = await this.validate(data);
      if (!toolCall?.function) {
        throw new ApplicationError({
          module: 'Document',
          code: 'S.CDS.03',
          message: 'Função não encontrada.',
        });
      }

      return this[toolCall.function.name](toolCall, ignoreValidation, extractedText);
    } catch (error) {
      if (error instanceof ApplicationError) {
        throw error;
      }

      throw new ApplicationError({
        module: 'Document',
        code: 'S.CDS.01',
        message: 'Erro ao categorizar o documento.',
        errors: [error],
      });
    }
  }

  async identity<T extends CreateIdentityDto>(
    data: ChatCompletionMessageToolCall,
    _ignoreValidation: boolean,
    extractedText: string,
  ): Promise<Document<DocumentType.IDENTITY, CreateIdentityDto>> {
    const { personName, personCPF, birthDate, affiliation } = this.parse<T>(data);
    const person = await this.findUser.byDocumentWithoutThrow(
      removeDocumentMask(personCPF),
      { removedAt: null },
    );

    return {
      type: DocumentType.IDENTITY,
      holder: 'unknown',
      data: {
        side: this.getIdentitySide(this.parse<T>(data), extractedText),
        personName,
        personCPF,
        birthDate,
        ...(affiliation && {
          affiliation: {
            motherName: affiliation.motherName,
            fatherName: affiliation.fatherName,
          },
        }),
        ...(person && {
          person: {
            id: person.id,
            document: person.document,
            profile: {
              firstName: person.profile.firstName,
              lastName: person.profile.lastName,
              email: person.profile.email,
              phone: person.profile.phone,
            },
            ...(person.representative && {
              representative: {
                id: person.representative.id,
                document: person.representative.document,
                profile: {
                  firstName: (person.representative as typeof person).profile.firstName,
                  lastName: (person.representative as typeof person).profile.lastName,
                  email: (person.representative as typeof person).profile.email,
                  phone: (person.representative as typeof person).profile.phone,
                },
              },
            }),
          },
        }),
      },
    };
  }

  async proof_of_address<T extends CreateProofOfAddressDto>(
    data: ChatCompletionMessageToolCall,
  ): Promise<Document<DocumentType.PROOF_OF_ADDRESS, CreateProofOfAddressDto>> {
    const { personName, address } = this.parse<T>(data);

    return {
      type: DocumentType.PROOF_OF_ADDRESS,
      holder: 'unknown',
      data: {
        personName,
        address,
      },
    };
  }

  async power_of_attorney<T extends CreatePowerOfAttorneyDto>(
    data: ChatCompletionMessageToolCall,
  ): Promise<Document<DocumentType.POWER_OF_ATTORNEY, CreatePowerOfAttorneyDto>> {
    const { signatureDate, expirationDate, grantor, attorney } = this.parse<T>(data);

    return {
      type: DocumentType.POWER_OF_ATTORNEY,
      holder: 'patient',
      data: {
        signatureDate,
        expirationDate,
        grantor,
        attorney,
      },
    };
  }

  async medical_prescription<T extends CreateMedicalPrescriptionDto>(
    data: ChatCompletionMessageToolCall,
    ignoreValidation: boolean = false,
  ): Promise<Document<DocumentType.MEDICAL_PRESCRIPTION, CreateMedicalPrescriptionDto>> {
    const { doctorCRM, doctorName, patientName, productId, prescriptionDate } =
      this.parse<T>(data);

    if (!ignoreValidation && !validateCRM(normalizeCRM(doctorCRM))) {
      this.logger.error('Invalid CRM', doctorCRM);
      throw new NotAcceptableError({
        module: 'Document',
        code: 'S.CDS.07',
        message: 'CRM do médico inválido.',
        details: {
          retry: true,
          data: this.parse<T>(data),
        },
      });
    }

    const patient = await this.findUser.byFullNameWithoutThrow(patientName, {
      removedAt: null,
    });

    const doctor = await this.findUser.byDocumentWithoutThrow(doctorCRM, {
      removedAt: null,
    });

    if (productId != null) {
      const product = await this.findStockProduct.findFirstByProductId(productId, {
        quantity: 'desc',
      });

      if (!product) {
        throw new ApplicationError({
          module: 'Document',
          code: 'S.CDS.05',
          message: 'Produto não encontrado.',
        });
      }

      return {
        type: DocumentType.MEDICAL_PRESCRIPTION,
        holder: 'patient',
        data: {
          prescriptionDate,
          doctorId: doctor?.id,
          doctorName,
          doctorCRM,
          patientName,
          ...(patient && {
            patient: {
              id: patient.id,
              document: patient.document,
              profile: {
                firstName: patient.profile.firstName,
                lastName: patient.profile.lastName,
                email: patient.profile.email,
                phone: patient.profile.phone,
              },
              ...(patient.representative && {
                representative: {
                  id: patient.representative.id,
                  document: patient.representative.document,
                  profile: {
                    firstName: (patient.representative as typeof patient).profile
                      .firstName,
                    lastName: (patient.representative as typeof patient).profile.lastName,
                    email: (patient.representative as typeof patient).profile.email,
                    phone: (patient.representative as typeof patient).profile.phone,
                  },
                },
              }),
            },
          }),
          product,
        },
      };
    }

    return {
      type: DocumentType.MEDICAL_PRESCRIPTION,
      holder: 'patient',
      data: {
        prescriptionDate,
        doctorId: doctor?.id,
        doctorName,
        doctorCRM,
        patientName,
        ...(patient && {
          patient: {
            id: patient.id,
            document: patient.document,
            profile: {
              firstName: patient.profile.firstName,
              lastName: patient.profile.lastName,
              email: patient.profile.email,
              phone: patient.profile.phone,
            },
            ...(patient.representative && {
              representative: {
                id: patient.representative.id,
                document: patient.representative.document,
                profile: {
                  firstName: (patient.representative as typeof patient).profile.firstName,
                  lastName: (patient.representative as typeof patient).profile.lastName,
                  email: (patient.representative as typeof patient).profile.email,
                  phone: (patient.representative as typeof patient).profile.phone,
                },
              },
            }),
          },
        }),
      },
    };
  }

  async anvisa_authorization<T extends CreateAnvisaAuthorizationDto>(
    data: ChatCompletionMessageToolCall,
    ignoreValidation: boolean = false,
  ): Promise<Document<DocumentType.ANVISA_AUTHORIZATION, CreateAnvisaAuthorizationDto>> {
    const {
      authorizationNumber,
      expirationDate,
      personName,
      personCPF,
      legalGuardianName,
      legalGuardianCPF,
      doctorName,
      doctorCRM,
      manufacturerName,
      manufacturerCNPJ,
      productType,
    } = this.parse<T>(data);

    if (
      !ignoreValidation &&
      !validateAuthorizationNumber(normalizeAuthorizationNumber(authorizationNumber))
    ) {
      this.logger.error('Invalid authorization number', authorizationNumber);
      throw new NotAcceptableError({
        module: 'Document',
        code: 'S.CDS.08',
        message: 'Número de autorização da ANVISA inválido.',
        details: {
          retry: true,
          data: this.parse<T>(data),
        },
      });
    } else if (!ignoreValidation && !validateCRM(normalizeCRM(doctorCRM))) {
      this.logger.error('Invalid CRM', doctorCRM);
      throw new NotAcceptableError({
        module: 'Document',
        code: 'S.CDS.09',
        message: 'CRM do médico inválido.',
        details: {
          retry: true,
          data: this.parse<T>(data),
        },
      });
    }

    const doctor = await this.findUser.byDocumentWithoutThrow(doctorCRM, {
      removedAt: null,
    });

    const person = await this.findUser.byDocumentWithoutThrow(
      removeDocumentMask(personCPF),
      { removedAt: null },
    );

    return {
      type: DocumentType.ANVISA_AUTHORIZATION,
      holder: 'patient',
      data: {
        authorizationNumber,
        expirationDate,
        personName,
        personCPF,
        ...(person && {
          person: {
            id: person.id,
            document: person.document,
            profile: {
              firstName: person.profile.firstName,
              lastName: person.profile.lastName,
              email: person.profile.email,
              phone: person.profile.phone,
            },
            ...(person.representative && {
              representative: {
                id: person.representative.id,
                document: person.representative.document,
                profile: {
                  firstName: (person.representative as typeof person).profile.firstName,
                  lastName: (person.representative as typeof person).profile.lastName,
                  email: (person.representative as typeof person).profile.email,
                  phone: (person.representative as typeof person).profile.phone,
                },
              },
            }),
          },
        }),
        legalGuardianRequired: legalGuardianName && legalGuardianCPF ? true : false,
        legalGuardianName,
        legalGuardianCPF,
        doctorId: doctor?.id,
        doctorName,
        doctorCRM,
        manufacturerName,
        manufacturerCNPJ,
        productType,
      },
    };
  }

  async unknown_document<T extends { message: string }>(
    data: ChatCompletionMessageToolCall,
  ) {
    const { message } = this.parse<T>(data);
    throw new ApplicationError({
      module: 'Document',
      code: 'S.CDS.04',
      message,
      details: {
        type: DocumentType.OTHER,
        data: this.parse<T>(data),
      },
    });
  }

  getIdentitySide<T extends CreateIdentityDto>(data: T, extractedText: string) {
    return extractedText.includes('ASSINATURA DO TITULAR') &&
      (!data.personName ||
        !data.personCPF ||
        !validateCPF(removeDocumentMask(data.personCPF)))
      ? 'front'
      : 'back';
  }

  async validate(data: ChatCompletionMessageToolCall[]) {
    if (!data?.length || (data?.length > 0 && !data[0].id)) {
      throw new ApplicationError({
        module: 'Document',
        code: 'S.CDS.02',
        message:
          'Não foi possível processar o documento, por favor, verifique se o documento está legível e tente novamente.',
      });
    }

    return data[0];
  }

  parse<T = any>(data: ChatCompletionMessageToolCall): T {
    return JSON.parse(data.function.arguments) as T;
  }
}
