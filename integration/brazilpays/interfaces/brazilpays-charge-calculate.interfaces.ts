import { LinkType } from './brazilpays.interfaces';

export interface BrazilPaysChargeCalculateRequest {
  amount: number;
  baseChargeId: string;
  linkType: LinkType;
  feeIsForTheMerchant: boolean;
  installmentFeeIsForTheMerchant: string;
  minimumAmountInstallments: number;
}

export interface BrazilPaysChargeCalculateResponse {
  iof: number;
  exchange: number;
  valueBRL: number;
  valueUSD: number;
}
