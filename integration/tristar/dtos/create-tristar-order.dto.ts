import {
  CountryCode,
  CountryID,
  CurrencyID,
  DocumentType,
  PersonType,
  ShipmentItem,
} from '../interfaces/tristar.enum';

export interface CreateTristarOrderDto {
  id_ext: string;
  order_number: string;
  from_person_type: PersonType;
  from_name: string;
  from_document_type: DocumentType;
  from_document: string;
  from_company_name?: string;
  from_trading_name?: string;
  from_country_id: CountryID;
  from_country_code: CountryCode;
  from_state_id?: number;
  from_state_code: string;
  from_postcode: string;
  from_br_ie?: string;
  from_address_1: string;
  from_address_2: string;
  from_address_number: string;
  from_address_complement?: string;
  from_city: string;
  to_person_type: PersonType;
  to_name: string;
  to_document_type: DocumentType;
  to_document: string;
  to_company_name?: string;
  to_trading_name?: string;
  to_br_ie?: string;
  to_address_1: string;
  to_address_2: string;
  to_address_number: string;
  to_address_complement?: string;
  to_city: string;
  to_country_id: CountryID;
  to_country_code: CountryCode;
  to_state_id?: number;
  to_state_code: string;
  to_postcode: string;
  to_email: string;
  to_phone: string;
  package_width: number;
  package_height: number;
  package_length: number;
  package_weight: number;
  freight: number;
  insurance?: number;
  total: number;
  anvisa_import_authorization_number: string;
  anvisa_product_commercial_name: string;
  with_insurance: boolean;
  items: Item[];
}

export interface Item {
  shipment_item_type: ShipmentItem;
  hscode: string;
  description: string;
  quantity: number;
  unity_price: number;
  expiration_date?: string;
  lot?: string;
  immune_code?: string;
  is_book: boolean;
  currency_id?: CurrencyID;
}
