import { PaymentLinkStatus } from '@/app/payment-link/enums/payment-link.enum';
import { PaymentMethod } from '@/app/payment/enums/payment.enum';

export class UpdatePaymentLinkDto {
  status?: PaymentLinkStatus;
  referenceId?: string;
  paymentMethod?: PaymentMethod;
  exchangeAtPayment?: number;
  installmentCustomer?: number;
}
