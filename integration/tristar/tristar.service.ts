import { HttpStatus, Injectable } from '@nestjs/common';
import { ApplicationError } from '@/common/errors/application.error';
import { BaseService } from '@/infra/base/base.service';
import { HTTPService } from '@/infra/base/http.service';
import { ConfigService } from '@/config/config.service';
import { CreateTristarOrderDto } from './dtos/create-tristar-order.dto';
import { CreateAnvisaAuthorizationDto } from '@/app/document/dtos/create-anvisa-authorization.dto';
import { TristarStatesResponse } from './interfaces/tristar-states.interfaces';
import { OrderData } from './interfaces/tristar.interfaces';
import {
  CountryCode,
  CountryID,
  PersonType,
  ShipmentItem,
  DocumentType as TDocumentType,
} from './interfaces/tristar.enum';
import { DocumentType } from '@/app/document/interfaces/document-types.interfaces';
import { Address } from '@/app/document/dtos/document.dto';

@Injectable()
export class TristarService extends BaseService {
  private readonly client: HTTPService = new HTTPService(this.config.TRISTAR_API_URL, {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${this.config.TRISTAR_API_KEY}`,
  });

  constructor(private readonly config: ConfigService) {
    super();
  }

  async authCheck() {
    try {
      const { data } = await this.client.get('/authentication');
      return data;
    } catch (error) {
      throw new ApplicationError({
        module: 'Tristar',
        code: 'I.TS.06',
        message: error.response?.data.message || error.message,
        details: error.response?.data.errors,
        status: error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async createOrder(data: OrderData): Promise<CreateTristarOrderDto> {
    await this.validateRequiredDocuments(data);

    const anvisaDocument = this.getDocument<CreateAnvisaAuthorizationDto>(
      data.documents,
      DocumentType.ANVISA_AUTHORIZATION,
    );

    const orderData: CreateTristarOrderDto = {
      id_ext: data.id,
      order_number: data.invoice,
      anvisa_import_authorization_number: anvisaDocument.metadata.authorizationNumber,
      anvisa_product_commercial_name: anvisaDocument.metadata.productType,
      from_person_type: PersonType.COMPANY,
      from_name: 'Entourage Phytolab LLC',
      from_company_name: 'Entourage Phytolab LLC',
      from_trading_name: 'Entourage Phytolab LLC',
      from_postcode: '33182',
      from_address_1: '12600 NW 25th Street, Suite 100',
      from_address_2: '',
      from_address_number: '',
      from_address_complement: 'Warehouse 3',
      from_city: 'Miami',
      from_state_code: 'FL',
      from_country_id: CountryID.US,
      from_country_code: CountryCode.US,
      from_document_type: TDocumentType.TAX_ID,
      from_document: null,
      to_person_type: PersonType.PERSONAL,
      to_name: data.customer.name,
      to_email: '',
      to_phone: '',
      to_postcode: data.shipping.address.postalCode,
      to_address_1: this.getAddressString(CountryCode.BR, data.shipping.address),
      to_address_2: '',
      to_address_number: '',
      to_address_complement: data.shipping.address.complement,
      to_country_id: CountryID.BR,
      to_country_code: CountryCode.BR,
      to_city: data.shipping.address.city,
      to_document_type: TDocumentType.TAX_ID,
      to_document: data.customer.document,
      to_state_code: data.shipping.address.state,
      total: data.products[0].price * data.products[0].quantity,
      freight: data.shipping.price,
      with_insurance: data.shipping.insurance,
      package_width: null,
      package_height: null,
      package_length: null,
      package_weight: null,
      items: data.products.map(({ product, price, quantity }) => ({
        shipment_item_type: ShipmentItem.CBD,
        description: product.description,
        unity_price: price,
        quantity: quantity,
        hscode: product.hsCode,
        is_book: false,
      })),
    };

    try {
      const { data } = await this.client.post('/shipments', orderData);
      return data;
    } catch (error) {
      throw new ApplicationError({
        module: 'Tristar',
        code: 'I.TS.02',
        message: error.response?.data.message || error.message,
        details: error.response?.data.errors,
        status: error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getStates(countryId: CountryID): Promise<TristarStatesResponse> {
    try {
      const { data } = await this.client.get<TristarStatesResponse>(
        `/country-states/${countryId}`,
      );

      return data;
    } catch (error) {
      throw new ApplicationError({
        module: 'Tristar',
        code: 'I.TS.01',
        message: error.response?.data.message || error.message,
        details: error.response?.data.errors,
        status: error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getStateId(countryId: CountryID, stateCode: string): Promise<number> {
    const states = await this.getStates(countryId);
    const state = states.data.find((s) => s.code === stateCode);

    if (!state) {
      throw new ApplicationError({
        module: 'Tristar',
        code: 'I.TS.05',
        message: 'Estado não encontrado.',
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return state.id;
  }

  private async validateRequiredDocuments(order: OrderData) {
    const requiredDocuments: DocumentType[] = [
      DocumentType.IDENTITY,
      DocumentType.ANVISA_AUTHORIZATION,
      DocumentType.MEDICAL_PRESCRIPTION,
      DocumentType.PROOF_OF_ADDRESS,
    ];

    if (order.legalGuardian) {
      requiredDocuments.push(DocumentType.POWER_OF_ATTORNEY);
    }

    const missingDocuments = requiredDocuments.filter(
      (doc) => !order.documents.find((d) => d.type === doc),
    );

    if (missingDocuments.length) {
      throw new ApplicationError({
        module: 'Tristar',
        code: 'I.TS.04',
        message: 'Documentos obrigatórios não encontrados no pedido.',
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  private getDocument<T>(documents: OrderData['documents'], type: DocumentType) {
    const document = documents.find((doc) => doc.type === type);
    if (!document) {
      throw new ApplicationError({
        module: 'Tristar',
        code: 'I.TS.03',
        message: 'O pedido não possui o documento necessário.',
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return document as typeof document & { metadata: T };
  }

  private getAddressString(countryCode: CountryCode, address: Address): string {
    const { street, number, neighborhood, complement } = address;
    return countryCode === CountryCode.BR
      ? `${street}, ${number}${complement ? `, ${complement}` : ''} - ${neighborhood}`
      : `${number} ${street}${complement ? `, ${complement}` : ''} - ${neighborhood}`;
  }
}
