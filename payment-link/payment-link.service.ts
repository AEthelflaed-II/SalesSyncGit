import { Injectable } from '@nestjs/common';
import { ConfigService } from '@/config/config.service';

@Injectable()
export class PaymentLinkService {
  constructor(private readonly config: ConfigService) {}

  getPaymentLinkUrl(id: string) {
    return `${this.config.CHECKOUT_URL}/link/${id}`;
  }
}
