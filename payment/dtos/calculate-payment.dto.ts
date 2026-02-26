import { CurrencyType } from '@/app/payment/interfaces/payment.interfaces';

export class CalculatePaymentDto {
  value: number;
  currency: CurrencyType;
  feeForMerchant: boolean;
  installment: number;
}
