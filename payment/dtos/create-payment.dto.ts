import { PaymentProvider } from '../interfaces/payment.interfaces';

export class CreatePaymentDto {
  provider: PaymentProvider;
  status: string;
  currency: string;
  amount: number;
  paymentId?: string;
  paymentUrl?: string;
  paymentDate?: Date;
  orderId: string;
}
