import { Injectable, Logger } from '@nestjs/common';
import { PaymentLinkRepository } from '@/infra/database/prisma/repositories/payment-link.repository';
import { SecurityService } from '@/infra/security/security.service';
import { CreatePaymentLinkDto } from '../dtos/create-payment-link.dto';
import { PaymentLinkStatus } from '../enums/payment-link.enum';
import { CurrencyType } from '@/app/payment/interfaces/payment.interfaces';

@Injectable()
export class CreatePaymentLinkService {
  private readonly logger: Logger = new Logger(CreatePaymentLinkService.name);
  constructor(
    private readonly security: SecurityService,
    private readonly paymentLinkRepository: PaymentLinkRepository,
  ) {}

  async execute({
    status = PaymentLinkStatus.CREATED,
    currency = CurrencyType.BRL,
    feeForMerchant = true,
    installmentMerchant = 1,
    ...data
  }: Omit<CreatePaymentLinkDto, 'secretKey'>) {
    const secretKey = this.security.createSecretKey();
    return this.paymentLinkRepository.create({
      ...data,
      status,
      currency,
      installmentMerchant,
      feeForMerchant,
      secretKey,
    });
  }
}
