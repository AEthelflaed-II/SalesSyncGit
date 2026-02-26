import { Injectable } from '@nestjs/common';
import { NotFoundError } from '@/common/errors/not-found.error';
import { PaymentLinkRepository } from '@/infra/database/prisma/repositories/payment-link.repository';
import { UpdatePaymentLinkDto } from '../dtos/update-payment-link.dto';

@Injectable()
export class UpdatePaymentLinkService {
  constructor(private readonly paymentLinkRepository: PaymentLinkRepository) {}

  async execute(id: string, data: UpdatePaymentLinkDto) {
    const paymentLink = await this.paymentLinkRepository.findOne(id);
    if (!paymentLink) {
      throw new NotFoundError({
        module: 'PaymentLink',
        code: 'S.PPL.01',
        message: 'Link de pagamento não encontrado.',
      });
    }

    return this.paymentLinkRepository.update(id, data);
  }
}
