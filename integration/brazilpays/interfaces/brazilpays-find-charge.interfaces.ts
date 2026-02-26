export interface BrazilPaysFindChargeResponse {
  id: string;
  created: number;
  paymentStatus: number;
  b2EStatus: number;
  qrCode: string;
  qrCodeImage: string;
  transactionUuid: string;
  manualConfirmation?: boolean;
  iof: number;
  paymentDate?: string;
  codeSale: string;
  gatewayFee: number;
  platformFee: number;
  withoutInterest: boolean;
  commissioned: Commissioned[];
  amountReceivable: number;
  urlWebHook: string;
  gatewayPix: number;
  gateway: number;
  linkType: number;
  feeIsForTheMerchant: boolean;
  usdSpread: number;
  totalInstallmentsWithoutInterest: number;
  installmentFeeIsForTheMerchant: number;
  showAllCoins?: boolean;
  showExchange?: boolean;
  linkDueDate?: string;
  minimumAmountInstallments: number;
  reachedLimit: boolean;
  merchant: Merchant;
  profile: Profile;
  exchange: number;
  usedExchange: number;
  baseChargeId?: string;
  invoice: string;
  description: string;
  typeCharge: number;
  paymentMethod: number;
  installment: number;
  valuesBrl: ValuesBrl;
  valuesUsd: ValuesUsd;
  isExternal: boolean;
  reference?: string;
  amount?: number;
}

export interface Commissioned {
  commissionFee: number;
  commissionValue: number;
  id: string;
  name: string;
}

export interface Merchant {
  corporateName: string;
  id: string;
  name?: string;
}

export interface Profile {
  zipCode: string;
  streetAddress: string;
  number: string;
  cityName: string;
  stateName: string;
  stateUf: string;
  neighborhood: string;
  complement: string;
  personType: number;
  fullName: string;
  email: string;
  phone: string;
  cpfOrCnpj: string;
  customBillingAddress: boolean;
  creditCard: any;
  gender: string;
  birthDate: string;
}

export interface ValuesBrl {
  netValue: number;
  platformValue: number;
  grossValue: number;
  gatewayValue: number;
  valuePerInstallment: number;
}

export interface ValuesUsd {
  netValue: number;
  platformValue: number;
  grossValue: number;
  gatewayValue: number;
  valuePerInstallment: number;
}
