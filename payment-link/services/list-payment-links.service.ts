import { Injectable } from '@nestjs/common';
import { PaymentLinkRepository } from '@/infra/database/prisma/repositories/payment-link.repository';
import { ListPaymentLinksDto } from '../dtos/list-payment-links.dto';

@Injectable()
export class ListPaymentLinksService {
  constructor(private readonly paymentLinkRepository: PaymentLinkRepository) {}

  async execute(options: ListPaymentLinksDto) {
    return this.paymentLinkRepository.list(options);
  }
}
