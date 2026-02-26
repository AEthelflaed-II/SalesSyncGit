import { PaymentMethod } from '@/app/payment/enums/payment.enum';
import { GenderType } from '@/infra/integration/brazilpays/interfaces/brazilpays-charge-create.interfaces';

export interface PayPaymentLinkDto {
  exchange: number;
  profile: PayPaymentLinkProfileDto;
  installments?: number;
  paymentLinkId: string;
  paymentMethod: PaymentMethod;
}

export interface PayPaymentLinkProfileCreditCardDto {
  cardNumber: string;
  holderName: string;
  expireMonth: string;
  expireYear: string;
  cvv: string;
}

export interface PayPaymentLinkProfileDto {
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
  creditCard?: PayPaymentLinkProfileCreditCardDto;
  gender: GenderType;
  birthDate: string;
}
