import { CurrencyType } from '@/app/payment/interfaces/payment.interfaces';
import { PaymentLinkStatus } from '../enums/payment-link.enum';

export class CreatePaymentLinkPaymentMethodInstallmentDto {
  number: number;
  value: number;
  amount: number;
  amountNet: number;
  platformFee: number;
  gatewayFee: number;
  iof: number;
  feeForMerchant: boolean;
}

export class CreatePaymentLinkPaymentMethodDto {
  amount: number;
  amountNet: number;
  platformFee: number;
  gatewayFee: number;
}

export class CreatePaymentLinkPaymentMethodWithInstallmentsDto extends CreatePaymentLinkPaymentMethodDto {
  installments?: CreatePaymentLinkPaymentMethodInstallmentDto[];
}

export class CreatePaymentLinkExchangeQuoteDto {
  currency: CurrencyType;
  amount: number;
  amountNet: number;
  exchange: number;
  exchangeRef: number;
  platformFee: number;
  gatewayFee: number;
  iof: number;
  pix: CreatePaymentLinkPaymentMethodDto;
  creditCard: CreatePaymentLinkPaymentMethodWithInstallmentsDto;
}

export class CreatePaymentLinkDto {
  status?: PaymentLinkStatus;
  currency: CurrencyType;
  amount: number;
  referenceId?: string;
  exchangeQuote: CreatePaymentLinkExchangeQuoteDto;
  feeForMerchant: boolean;
  installmentMerchant: number;
  secretKey: string;
  orderId?: string;
  expiresAt: Date;
}
