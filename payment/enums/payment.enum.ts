export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  REFUSED = 'refused',
  EXPIRED = 'expired',
  CANCELED = 'canceled',
  RELEASED = 'released',
  REVERSED = 'reversed',
}

export enum PaymentMethod {
  PIX = 'pix',
  CREDIT_CARD = 'credit_card',
}
