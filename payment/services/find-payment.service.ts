import { Injectable } from '@nestjs/common';
import { PaymentRepository } from '@/infra/database/prisma/repositories/payment.repository';

@Injectable()
export class FindPaymentService {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  async execute(paymentId: string) {
    return this.paymentRepository.findOneByPaymentId(paymentId);
  }
}
