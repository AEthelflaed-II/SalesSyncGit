import { PaymentLinkStatus } from '@/app/payment-link/enums/payment-link.enum';
import { CurrencyType } from '@/app/payment/interfaces/payment.interfaces';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreatePaymentLinkPaymentMethodInstallmentRequestDto {
  @ApiProperty({
    description: 'Número da parcela',
    example: 1,
    type: Number,
  })
  @IsNotEmpty({ message: 'Número da parcela é obrigatório' })
  @IsNumber({ maxDecimalPlaces: 0 }, { message: 'Número da parcela deve ser um número' })
  @IsInt({ message: 'Número da parcela deve ser um número inteiro' })
  @Min(1, { message: 'Número da parcela deve ser entre 1 e 12' })
  @Max(12, { message: 'Número da parcela deve ser entre 1 e 12' })
  number: number;

  @ApiProperty({
    description: 'Valor da parcela',
    example: 123.72,
    type: Number,
  })
  @IsNotEmpty({ message: 'Valor da parcela é obrigatório' })
  @IsNumber({}, { message: 'Valor da parcela deve ser um número' })
  value: number;

  @ApiProperty({
    description: 'Valor total da transação (incluindo taxas de parcelamento)',
    example: 987.92,
    type: Number,
  })
  @IsNotEmpty({ message: 'Valor total da transação é obrigatório' })
  @IsNumber({}, { message: 'Valor total da transação deve ser um número' })
  amount: number;

  @ApiProperty({
    description: 'Valor líquido da transação (sem taxas)',
    example: 854.68,
    type: Number,
  })
  amountNet: number;

  @ApiProperty({
    description: 'Taxa da plataforma',
    example: 5.87,
    type: Number,
  })
  @IsNotEmpty({ message: 'Taxa da plataforma é obrigatória' })
  @IsNumber({}, { message: 'Taxa da plataforma deve ser um número' })
  platformFee: number;

  @ApiProperty({
    description: 'Taxa do gateway',
    example: 0.4,
    type: Number,
  })
  @IsNotEmpty({ message: 'Taxa do gateway é obrigatória' })
  @IsNumber({}, { message: 'Taxa do gateway deve ser um número' })
  gatewayFee: number;

  @ApiProperty({
    description: 'IOF (Imposto sobre Operações Financeiras)',
    example: 0.38,
    type: Number,
  })
  @IsNotEmpty({ message: 'IOF é obrigatório' })
  @IsNumber({}, { message: 'IOF deve ser um número' })
  iof: number;

  @ApiProperty({
    description: 'Repassar taxas para o comerciante?',
    example: true,
    type: Boolean,
  })
  @IsNotEmpty({
    message: 'Definição de repasse de taxas para o comerciante é obrigatório',
  })
  @IsBoolean({
    message: 'Definição de repasse de taxas para o comerciante deve ser um booleano',
  })
  feeForMerchant: boolean;
}

export class CreatePaymentLinkPaymentMethodRequestDto {
  @ApiProperty({
    description: 'Valor total da transação (incluindo taxas de parcelamento se houver)',
    example: 987.92,
    type: Number,
  })
  @IsNotEmpty({ message: 'Valor total da transação é obrigatório' })
  @IsNumber({}, { message: 'Valor total da transação deve ser um número' })
  amount: number;

  @ApiProperty({
    description: 'Valor líquido da transação (sem taxas)',
    example: 854.68,
    type: Number,
  })
  @IsNotEmpty({ message: 'Valor líquido da transação é obrigatório' })
  @IsNumber({}, { message: 'Valor líquido da transação deve ser um número' })
  amountNet: number;

  @ApiProperty({
    description: 'Taxa da plataforma',
    example: 5.87,
    type: Number,
  })
  @IsNotEmpty({ message: 'Taxa da plataforma é obrigatória' })
  @IsNumber({}, { message: 'Taxa da plataforma deve ser um número' })
  platformFee: number;

  @ApiProperty({
    description: 'Taxa do gateway',
    example: 0.4,
    type: Number,
  })
  @IsNotEmpty({ message: 'Taxa do gateway é obrigatória' })
  @IsNumber({}, { message: 'Taxa do gateway deve ser um número' })
  gatewayFee: number;
}

export class CreatePaymentLinkPaymentMethodWithInstallmentsRequestDto extends CreatePaymentLinkPaymentMethodRequestDto {
  @ApiProperty({
    description: 'Parcelas do pagamento (se o método de pagamento for cartão de crédito)',
    type: [CreatePaymentLinkPaymentMethodInstallmentRequestDto],
  })
  @IsNotEmptyObject({}, { message: 'Parcelas do pagamento são obrigatórias', each: true })
  @ValidateNested({
    each: true,
    message: 'Parcelas do pagamento devem ser uma lista de objetos',
  })
  @Type(() => CreatePaymentLinkPaymentMethodInstallmentRequestDto)
  installments?: CreatePaymentLinkPaymentMethodInstallmentRequestDto[];
}

export class ExchangeQuote {
  @ApiProperty({
    description: 'Moeda da transação',
    example: CurrencyType.BRL,
    enum: CurrencyType,
  })
  @IsNotEmpty({ message: 'Moeda da transação é obrigatória' })
  @IsString({ message: 'Moeda da transação deve ser uma string' })
  @IsEnum(CurrencyType, {
    message: 'Moeda da transação deve ser uma moeda válida',
  })
  currency: CurrencyType;

  @ApiProperty({
    description: 'Valor total da transação (incluindo taxas de parcelamento se houver)',
    example: 987.92,
    type: Number,
  })
  @IsNotEmpty({ message: 'Valor total da transação é obrigatório' })
  @IsNumber({}, { message: 'Valor total da transação deve ser um número' })
  amount: number;

  @ApiProperty({
    description: 'Valor líquido da transação (sem taxas)',
    example: 854.68,
    type: Number,
  })
  @IsNotEmpty({ message: 'Valor líquido da transação é obrigatório' })
  @IsNumber({}, { message: 'Valor líquido da transação deve ser um número' })
  amountNet: number;

  @ApiProperty({
    description: 'Taxa de câmbio utilizada',
    example: 5.7806,
    type: Number,
  })
  @IsNotEmpty({ message: 'Taxa de câmbio utilizada é obrigatória' })
  @IsNumber({}, { message: 'Taxa de câmbio utilizada deve ser um número' })
  exchange: number;

  @ApiProperty({
    description: 'Taxa de câmbio de referência',
    example: 5.7806,
    type: Number,
  })
  @IsNotEmpty({ message: 'Taxa de câmbio de referência é obrigatória' })
  @IsNumber({}, { message: 'Taxa de câmbio de referência deve ser um número' })
  exchangeRef: number;

  @ApiProperty({
    description: 'Taxa da plataforma',
    example: 5.87,
    type: Number,
  })
  @IsNotEmpty({ message: 'Taxa da plataforma é obrigatória' })
  @IsNumber({}, { message: 'Taxa da plataforma deve ser um número' })
  platformFee: number;

  @ApiProperty({
    description: 'Taxa do gateway',
    example: 0.4,
    type: Number,
  })
  @IsNotEmpty({ message: 'Taxa do gateway é obrigatória' })
  @IsNumber({}, { message: 'Taxa do gateway deve ser um número' })
  gatewayFee: number;

  @ApiProperty({
    description: 'IOF (Imposto sobre Operações Financeiras)',
    example: 0.38,
    type: Number,
  })
  @IsNotEmpty({ message: 'IOF é obrigatório' })
  @IsNumber({}, { message: 'IOF deve ser um número' })
  iof: number;

  @ApiProperty({
    description: 'Método de pagamento PIX',
    type: CreatePaymentLinkPaymentMethodRequestDto,
  })
  @IsNotEmptyObject({}, { message: 'Método de pagamento PIX é obrigatório' })
  @ValidateNested({
    each: true,
    message: 'Método de pagamento PIX deve ser um objeto',
  })
  @Type(() => CreatePaymentLinkPaymentMethodRequestDto)
  pix: CreatePaymentLinkPaymentMethodRequestDto;

  @ApiProperty({
    description: 'Método de pagamento Cartão de Crédito',
    type: CreatePaymentLinkPaymentMethodWithInstallmentsRequestDto,
  })
  @IsNotEmptyObject(
    {},
    { message: 'Método de pagamento Cartão de Crédito é obrigatório' },
  )
  @ValidateNested({
    each: true,
    message: 'Método de pagamento Cartão de Crédito deve ser um objeto',
  })
  @Type(() => CreatePaymentLinkPaymentMethodWithInstallmentsRequestDto)
  creditCard: CreatePaymentLinkPaymentMethodWithInstallmentsRequestDto;
}

export class CreatePaymentLinkRequestDto {
  @ApiPropertyOptional({
    description: 'Status do link de pagamento',
    example: PaymentLinkStatus.CREATED,
    enum: PaymentLinkStatus,
  })
  @IsOptional()
  @IsString({ message: 'Status do link de pagamento deve ser uma string' })
  @IsEnum(PaymentLinkStatus, {
    message: 'Status do link de pagamento deve ser um status válido',
  })
  status?: PaymentLinkStatus;

  @ApiProperty({
    description: 'Moeda da transação',
    example: CurrencyType.BRL,
    enum: CurrencyType,
  })
  @IsNotEmpty({ message: 'Moeda da transação é obrigatória' })
  @IsString({ message: 'Moeda da transação deve ser uma string' })
  @IsEnum(CurrencyType, {
    message: 'Moeda da transação deve ser uma moeda válida',
  })
  currency: CurrencyType;

  @ApiProperty({
    description: 'Valor total da transação (incluindo taxas de parcelamento se houver)',
    example: 987.92,
    type: Number,
  })
  @IsNotEmpty({ message: 'Valor total da transação é obrigatório' })
  @IsNumber({}, { message: 'Valor total da transação deve ser um número' })
  amount: number;

  @ApiPropertyOptional({
    description:
      'Identificador de referência da transação gerada na plataforma de pagamentos',
    example: '67eae0f4d70177d634b0684d',
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'Identificador de referência deve ser uma string' })
  referenceId?: string;

  @ApiProperty({
    description: 'Cota de câmbio para o link de pagamento no momento da criação',
    type: ExchangeQuote,
  })
  @IsNotEmptyObject({}, { message: 'Cota de câmbio é obrigatória' })
  @ValidateNested({ message: 'Cota de câmbio deve ser um objeto' })
  @Type(() => ExchangeQuote)
  exchangeQuote: ExchangeQuote;

  @ApiProperty({
    description: 'Repassar taxas para o comerciante?',
    example: true,
    type: Boolean,
  })
  @IsNotEmpty({
    message: 'Definição de repasse de taxas para o comerciante é obrigatório',
  })
  @IsBoolean({
    message: 'Definição de repasse de taxas para o comerciante deve ser um booleano',
  })
  feeForMerchant: boolean;

  @ApiProperty({
    description: 'Até quantas parcelas o comerciante assume as taxas',
    example: 6,
    type: Number,
  })
  @IsNotEmpty({ message: 'Definição de parcelas do comerciante é obrigatória' })
  @IsNumber(
    { maxDecimalPlaces: 0 },
    { message: 'Definição de parcelas do comerciante deve ser um número' },
  )
  @IsInt({ message: 'Definição de parcelas do comerciante deve ser um número inteiro' })
  @Min(1, { message: 'Definição de parcelas do comerciante deve ser entre 1 e 12' })
  @Max(12, { message: 'Definição de parcelas do comerciante deve ser entre 1 e 12' })
  installmentMerchant: number;

  @ApiProperty({
    description: 'Identificador da remessa associada ao link de pagamento',
    example: 'df4e2b4c-8f3d-4a5b-9c7f-1e2d3f4e5a6b',
    type: String,
  })
  @IsNotEmpty({ message: 'Identificador da remessa é obrigatório' })
  @IsString({ message: 'Identificador da remessa deve ser uma string' })
  @IsUUID(4, {
    message: 'Identificador da remessa deve ser um UUIDv4',
  })
  orderId: string;

  @Exclude()
  expiresAt: Date;
}
