import { Injectable } from '@nestjs/common';
import { ApplicationError } from '@/common/errors/application.error';
import { PaymentRepository } from '@/infra/database/prisma/repositories/payment.repository';
import { PaymentStatus } from '../enums/payment.enum';

@Injectable()
export class UpdatePaymentStatusService {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  async execute(id: string, status: PaymentStatus) {
    try {
      const payment = await this.paymentRepository.updateStatus(id, status);
      return payment;
    } catch (error) {
      throw new ApplicationError({
        module: 'Payment',
        code: 'S.PAY-UPS.0001',
        message: 'Erro ao atualizar status do pagamento',
        errors: [error],
      });
    }
  }
}
