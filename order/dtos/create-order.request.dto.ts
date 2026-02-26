import { CurrencyType } from '@/app/payment/interfaces/payment.interfaces';
import { ParseUppercase } from '@/infra/decorators/validation/parse-uppercase.decorator';
import { Optional } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Max,
  Min,
  MinLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

export class CreateOrderProductRequestDto {
  @ApiProperty({
    description: 'ID do produto no estoque',
    example: 'de4c8b8b-4b7b-4b7b-8b7b-4b7b8b7b4b7b',
  })
  @IsNotEmpty({ message: 'O ID do produto no estoque é obrigatório.' })
  @IsString({ message: 'O ID do produto no estoque deve ser uma string.' })
  @IsUUID(4, { message: 'O ID do produto no estoque deve ser um UUIDv4.' })
  stockProductId: string;

  @ApiProperty({
    description: 'Quantidade de cada produto',
    example: 2,
  })
  @IsNotEmpty({ message: 'A quantidade de cada produto é obrigatória.' })
  @IsNumber({}, { message: 'A quantidade de cada produto deve ser um número.' })
  @Min(1, { message: 'A quantidade de cada produto deve ser no mínimo 1.' })
  quantity: number;

  @ApiProperty({
    description: 'Preço do produto em dólares',
    example: 139.99,
  })
  @IsNotEmpty({ message: 'O preço do produto é obrigatório.' })
  @IsNumber({}, { message: 'O preço do produto deve ser um número.' })
  @Min(0.01, { message: 'O preço do produto deve ser no mínimo 0.01.' })
  price: number;

  @ApiPropertyOptional({
    description: 'Desconto em %',
    example: 10,
  })
  @IsOptional()
  @IsNumber({}, { message: 'O desconto do produto deve ser um número.' })
  @Min(0, { message: 'O desconto do produto deve ser no mínimo 0.' })
  @Max(100, { message: 'O desconto do produto deve ser no máximo 100.' })
  discount: number;
}

export class CreateOrderShippingAddressRequestDto {
  @ApiProperty({
    description: 'Rua',
    example: 'Rua das Flores',
  })
  @IsNotEmpty({ message: 'A rua é obrigatória.' })
  @IsString({ message: 'A rua deve ser uma string.' })
  @ParseUppercase()
  street: string;

  @ApiProperty({
    description: 'Número',
    example: '123',
  })
  @IsNotEmpty({ message: 'O número é obrigatório.' })
  @IsString({ message: 'O número deve ser uma string.' })
  @ParseUppercase()
  number: string;

  @ApiPropertyOptional({
    description: 'Complemento',
    example: 'Casa',
  })
  @IsOptional()
  @IsString({ message: 'O complemento deve ser uma string.' })
  @ParseUppercase()
  complement?: string;

  @ApiPropertyOptional({
    description: 'Bairro',
    example: 'Centro',
  })
  @IsOptional()
  @IsString({ message: 'O bairro deve ser uma string.' })
  @ParseUppercase()
  neighborhood: string;

  @ApiProperty({
    description: 'Cidade',
    example: 'São Paulo',
  })
  @IsNotEmpty({ message: 'A cidade é obrigatória.' })
  @IsString({ message: 'A cidade deve ser uma string.' })
  @ParseUppercase()
  city: string;

  @ApiProperty({
    description: 'Estado',
    example: 'SP',
  })
  @IsNotEmpty({ message: 'O estado é obrigatório.' })
  @IsString({ message: 'O estado deve ser uma string.' })
  @Length(2, 2, { message: 'O estado deve ter dois caracteres.' })
  @ParseUppercase()
  state: string;

  @ApiProperty({
    description: 'País',
    example: 'Brasil',
  })
  @IsNotEmpty({ message: 'O país é obrigatório.' })
  @IsString({ message: 'O país deve ser uma string.' })
  @ParseUppercase()
  country: string;

  @ApiProperty({
    description: 'CEP',
    example: '12345-678',
  })
  @IsNotEmpty({ message: 'O CEP é obrigatório.' })
  @IsString({ message: 'O CEP deve ser uma string.' })
  @MinLength(8, { message: 'O CEP deve ter ao menos 8 caracteres' })
  postalCode: string;
}

export class CreateOrderShippingRequestDto {
  @Exclude()
  tracking?: string;

  @ApiPropertyOptional({
    description: 'Preço do frete em dólares',
    example: 10.99,
  })
  @IsOptional()
  @IsNumber({}, { message: 'O preço do frete deve ser um número.' })
  price?: number;

  @ApiPropertyOptional({
    description: 'Utilizar seguro',
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'O seguro deve ser um booleano.' })
  insurance?: boolean;

  @ApiPropertyOptional({
    description: 'Valor do seguro',
    example: 10.99,
  })
  @IsOptional()
  @ValidateIf((o, value) => o.insurance && !value, {
    message: 'O valor do seguro é obrigatório quando o seguro é utilizado.',
  })
  @IsNumber({}, { message: 'O valor do seguro deve ser um número.' })
  insuranceValue?: number;

  @ApiPropertyOptional({
    description: 'Endereço de entrega',
    type: CreateOrderShippingAddressRequestDto,
  })
  @IsOptional()
  @ValidateNested({ message: 'O endereço de entrega deve ser um objeto.' })
  @Type(() => CreateOrderShippingAddressRequestDto)
  address: CreateOrderShippingAddressRequestDto;
}

export class CreateOrderPaymentMethodInstallmentRequestDto {
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

export class CreateOrderPaymentMethodRequestDto {
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

export class CreateOrderPaymentMethodWithInstallmentsRequestDto extends CreateOrderPaymentMethodRequestDto {
  @ApiProperty({
    description: 'Parcelas do pagamento (se o método de pagamento for cartão de crédito)',
    type: [CreateOrderPaymentMethodInstallmentRequestDto],
  })
  @IsNotEmptyObject({}, { message: 'Parcelas do pagamento são obrigatórias', each: true })
  @ValidateNested({
    each: true,
    message: 'Parcelas do pagamento devem ser uma lista de objetos',
  })
  @Type(() => CreateOrderPaymentMethodInstallmentRequestDto)
  installments?: CreateOrderPaymentMethodInstallmentRequestDto[];
}

export class CreateOrderExchangeQuoteDto {
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
    type: CreateOrderPaymentMethodRequestDto,
  })
  @IsNotEmptyObject({}, { message: 'Método de pagamento PIX é obrigatório' })
  @ValidateNested({
    each: true,
    message: 'Método de pagamento PIX deve ser um objeto',
  })
  @Type(() => CreateOrderPaymentMethodRequestDto)
  pix: CreateOrderPaymentMethodRequestDto;

  @ApiProperty({
    description: 'Método de pagamento Cartão de Crédito',
    type: CreateOrderPaymentMethodWithInstallmentsRequestDto,
  })
  @IsNotEmptyObject(
    {},
    { message: 'Método de pagamento Cartão de Crédito é obrigatório' },
  )
  @ValidateNested({
    each: true,
    message: 'Método de pagamento Cartão de Crédito deve ser um objeto',
  })
  @Type(() => CreateOrderPaymentMethodWithInstallmentsRequestDto)
  creditCard: CreateOrderPaymentMethodWithInstallmentsRequestDto;
}

export class CreateOrderRequestDto {
  @Exclude()
  invoice: string;

  @ApiProperty({
    description: 'ID do cliente',
    example: 'de4c8b8b-4b7b-4b7b-8b7b-4b7b8b7b4b7b',
  })
  @IsNotEmpty({ message: 'O ID do cliente é obrigatório.' })
  @IsString({ message: 'O ID do cliente deve ser uma string.' })
  @IsUUID(4, { message: 'O ID do cliente deve ser um UUIDv4.' })
  customerId: string;

  @ApiProperty({
    description: 'ID do representante',
    example: 'de4c8b8b-4b7b-4b7b-8b7b-4b7b8b7b4b7b',
  })
  @IsNotEmpty({ message: 'O ID do representante é obrigatório.' })
  @IsString({ message: 'O ID do representante deve ser uma string.' })
  @IsUUID(4, { message: 'O ID do representante deve ser um UUIDv4.' })
  representativeId: string;

  @ApiProperty({
    description: 'ID do médico',
    example: 'de4c8b8b-4b7b-4b7b-8b7b-4b7b8b7b4b7b',
  })
  @IsNotEmpty({ message: 'O ID do médico é obrigatório.' })
  @IsString({ message: 'O ID do médico deve ser uma string.' })
  @IsUUID(4, { message: 'O ID do médico deve ser um UUIDv4.' })
  doctorId: string;

  @ApiPropertyOptional({
    description: 'Moeda do pagamento',
    example: CurrencyType.BRL,
    enum: CurrencyType,
  })
  @Optional()
  @IsString({
    message: 'A moeda do pagamento deve ser uma string.',
  })
  @IsEnum(CurrencyType, { message: 'A moeda do pagamento deve ser BRL ou USD.' })
  currency: CurrencyType;

  @ApiPropertyOptional({
    description: 'Valor total da remessa',
    example: 139.99,
  })
  @IsOptional()
  @IsNumber({}, { message: 'O valor da remessa deve ser um número.' })
  @Min(0.0, { message: 'O valor da remessa deve ser no mínimo 0.01.' })
  amount: number;

  @ApiPropertyOptional({
    description: 'Desconto em %',
    example: 10,
  })
  @IsOptional()
  @IsNumber({}, { message: 'O desconto da remessa deve ser um número.' })
  @Min(0, { message: 'O desconto da remessa deve ser no mínimo 0.' })
  @Max(100, { message: 'O desconto da remessa deve ser no máximo 100.' })
  discount: number;

  @ApiProperty({
    description: 'Cota de câmbio para o link de pagamento no momento da criação',
    type: CreateOrderExchangeQuoteDto,
  })
  @IsNotEmptyObject({}, { message: 'Cota de câmbio é obrigatória' })
  @ValidateNested({ message: 'Cota de câmbio deve ser um objeto' })
  @Type(() => CreateOrderExchangeQuoteDto)
  exchangeQuote: CreateOrderExchangeQuoteDto;

  @ApiPropertyOptional({
    description: 'Repassar taxas para o comerciante?',
    example: true,
    type: Boolean,
  })
  @IsOptional()
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
    description: 'Produtos da remessa',
    type: [CreateOrderProductRequestDto],
  })
  @IsNotEmpty({ message: 'Os produtos da remessa são obrigatórios.' })
  @ArrayMinSize(1, { message: 'A remessa deve conter ao menos um produto.' })
  @ValidateNested({
    each: true,
    message: 'Os produtos da remessa devem ser uma lista de objetos.',
  })
  @Type(() => CreateOrderProductRequestDto)
  products: CreateOrderProductRequestDto[];

  @ApiProperty({
    description: 'Informações de envio',
    type: CreateOrderShippingRequestDto,
  })
  @IsNotEmpty({ message: 'A informação de envio é obrigatória.' })
  @ValidateNested({ message: 'A informação de envio deve ser um objeto.' })
  @Type(() => CreateOrderShippingRequestDto)
  shipping: CreateOrderShippingRequestDto;
}
