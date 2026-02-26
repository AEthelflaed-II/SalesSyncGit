import { ChargeType, LinkType, PaymentMethod } from './brazilpays.interfaces';

export enum GenderType {
  MALE = 'M',
  FEMALE = 'F',
}

export interface BrazilPaysChargeCreateRequest {
  profile: Profile;
  feeIsForTheMerchant: boolean;
  installmentFeeIsForTheMerchant: number;
  installment: number;
  exchange: number;
  usedExchange: number;
  baseChargeId?: string;
  invoice: string;
  description: string;
  reference: string;
  linkType: LinkType;
  typeCharge: ChargeType;
  paymentMethod: PaymentMethod;
  valuesUsd: ValuesUsd;
  valuesBrl?: ValuesBrl;
  urlWebHook: string;
}

export interface Profile {
  zipCode: string;
  streetAddress: string;
  number: string;
  cityName: string;
  stateName: string;
  stateUf: string;
  neighborhood: string;
  complement: string;
  fullName: string;
  email: string;
  phone: string;
  cpfOrCnpj: string;
  customBillingAddress?: boolean;
  creditCard?: CreditCard;
  gender: GenderType;
  birthDate: string;
}

export interface CreditCard {
  cardNumber: string;
  holderName: string;
  expireMonth: string;
  expireYear: string;
  cvv: string;
  billingAddress?: BillingAddress;
}

export interface BillingAddress {
  zipCode: string;
  streetAddress: string;
  number: string;
  cityName: string;
  stateName: string;
  stateUf: string;
  neighborhood: string;
  complement: string;
}

export interface ValuesUsd {
  netValue: number;
}

export interface ValuesBrl {
  netValue: string;
  grossValue: string;
}
export interface BrazilPaysChargeCreateResponse {
  id: string;
  profile: ProfileResponse;
  qrCode?: string;
  qrCodeImage?: string;
  valuesBrl: ValuesBrlResponse;
  valuesUsd: ValuesUsdResponse;
}

export interface ProfileResponse {
  id: string;
  name: string;
}

export interface ValuesBrlResponse {
  netValue: number;
  platformValue: number;
  grossValue: number;
  gatewayValue: number;
  valuePerInstallment: number;
}

export interface ValuesUsdResponse {
  netValue: number;
  platformValue: number;
  grossValue: number;
  gatewayValue: number;
  valuePerInstallment: number;
}
