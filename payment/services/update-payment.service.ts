import { Injectable } from '@nestjs/common';
import { PaymentRepository } from '@/infra/database/prisma/repositories/payment.repository';
import { CreatePaymentDto } from '../dtos/create-payment.dto';

@Injectable()
export class UpdatePaymentService {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  async execute(id: string, data: Partial<CreatePaymentDto>) {
    return this.paymentRepository.update(id, data);
  }
}
