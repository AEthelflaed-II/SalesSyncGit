import { Injectable, Logger } from '@nestjs/common';
import { PaymentRepository } from '@/infra/database/prisma/repositories/payment.repository';
import { CreatePaymentDto } from '../dtos/create-payment.dto';

@Injectable()
export class CreatePaymentService {
  private readonly logger: Logger = new Logger(CreatePaymentService.name);
  constructor(private readonly paymentRepository: PaymentRepository) {}

  async execute(data: CreatePaymentDto) {
    try {
      const payment = await this.paymentRepository.create(data);
      return payment;
    } catch (error) {
      this.logger.error('Erro ao criar pagamento', error);
      throw error;
    }
  }
}
