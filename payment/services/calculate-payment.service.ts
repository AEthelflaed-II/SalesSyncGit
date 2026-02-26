import { Injectable } from '@nestjs/common';
import { BrazilPaysService } from '@/infra/integration/brazilpays/brazilpays.service';
import { BrazilPaysChargeCalculateRequest } from '@/infra/integration/brazilpays/interfaces/brazilpays-charge-calculate.interfaces';
import { CalculatePaymentDto } from '../dtos/calculate-payment.dto';
import { CurrencyType } from '../interfaces/payment.interfaces';
import { LinkType } from '@/infra/integration/brazilpays/interfaces/brazilpays.interfaces';

@Injectable()
export class CalculatePaymentService {
  constructor(private readonly brazilPays: BrazilPaysService) {}
  async execute({ value, currency, feeForMerchant, installment }: CalculatePaymentDto) {
    const currencyMap: Record<CurrencyType, LinkType> = {
      BRL: LinkType.BRL,
      USD: LinkType.USD,
    };

    const data = await this.brazilPays.chargeCalculate({
      amount: value,
      feeIsForTheMerchant: feeForMerchant,
      installmentFeeIsForTheMerchant: feeForMerchant ? installment.toString() : null,
      linkType: currencyMap[currency],
    } as BrazilPaysChargeCalculateRequest);

    return data;
  }
}
