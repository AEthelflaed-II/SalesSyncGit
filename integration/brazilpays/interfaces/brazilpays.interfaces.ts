export interface BrazilPaysResponse<T extends object> {
  data: T;
  erro: boolean;
  errors: string;
  message: string;
  messageEx: string;
}

export enum LinkType {
  USD = 0,
  BRL = 1,
}

export enum ChargeType {
  LINK = 0,
  SMART_LINK = 1,
  DIRECT_CHARGE = 2,
}

export enum PaymentMethod {
  PIX = 0,
  BANK_SLIP = 1,
  CREDIT_CARD = 2,
}

export enum BrazilPaysPaymentStatus {
  PENDING = 0,
  PAID = 1,
  REFUSED = 2,
  EXPIRED = 3,
  CANCELED = 4,
  RELEASED = 5,
  REVERSED = 6,
}

export enum BrazilPaysB2EStatus {
  INITIAL = 0,
  WAITING_ANALYSIS = 1,
  IN_ANALYSIS = 2,
  AUTOMATICALLY_APPROVED = 3,
  REFUSED_SUSPECT = 4,
  REFUSED_FRAUD_CONFIRMED = 5,
  APPROVED = 6,
  APPROVED_WITH_RESERVATION = 7,
  WITHOUT_ANALYSIS = 8,
  PENDING = 9,
  LOSS = 10,
  CONTESTATION = 11,
  AUTOMATICALLY_REFUSED = 12,
  REFUSED_EXCLUDED = 13,
  WAITING_POSITIVE = 14,
  FALSE_POSITIVE = 15,
  REFUSED_CREDIT = 16,
}
