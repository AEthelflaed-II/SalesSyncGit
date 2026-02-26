import { BrazilPaysPaymentStatus, LinkType } from './brazilpays.interfaces';

export interface BrazilPaysBaseChargeCreateRequest {
  valuesUsd: ValuesUsd;
  invoice: string;
  description: string;
  urlWebHook: string;
  reference: string;
  feeIsForTheMerchant: boolean;
  installmentFeeIsForTheMerchant?: string;
  linkType: LinkType;
  urlRedirect: string;
  showAllCoins: boolean;
  showExchange: boolean;
  minimumAmountInstallments?: number;
  fixed: boolean;
  linkDueDate?: number;
  isRecurrence: boolean;
  profile: Profile;
  firstOccurrence?: number;
  frequency?: number;
  qtdRecurrence: number;
}

export interface BrazilPaysBaseChargeCreateResponse {
  id: string;
  merchant: Merchant;
  fixed: boolean;
  valuesUsd: ValuesUsd;
  invoice: string;
  description: string;
  link: string;
  used?: number;
  totalUsed?: number;
  urlWebHook: string;
  isExternal: boolean;
  reference: string;
  urlRedirect: string;
  linkType: LinkType;
  feeIsForTheMerchant: boolean;
  isRecurrence: boolean;
  profile: Profile;
  firstOccurrence?: number;
  frequency?: number;
  qtdRecurrence: number;
  baseChargeType?: number;
  dateCanceled?: number;
  paymentStatus: BrazilPaysPaymentStatus;
  installmentFeeIsForTheMerchant: number;
  showAllCoins: boolean;
  showExchange: boolean;
  linkDueDate?: number;
  minimumAmountInstallments: number;
  disabled?: number;
  created?: number;
}

export interface Merchant {
  id: string;
  corporateName: string;
}

export interface ValuesUsd {
  netValue: number;
}

export interface Profile {
  fullName: string;
  email: string;
}
