import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { PaymentMethod } from '@/app/payment/enums/payment.enum';
import { GenderType } from '@/infra/integration/brazilpays/interfaces/brazilpays-charge-create.interfaces';
import { IsDocument } from '@/infra/decorators/validation/is-document.decorator';
import { removeDocumentMask } from '@/common/utils/document';

export class PayPaymentLinkProfileCreditCardRequestDto {
  @ApiProperty({
    description: 'Número do cartão de crédito',
    example: '4111111111111111',
  })
  @IsNotEmpty({ message: 'O número do cartão de crédito é obrigatório.' })
  @IsString({ message: 'O número do cartão de crédito deve ser uma string.' })
  @Length(16, 16, { message: 'O número do cartão de crédito deve ter 16 dígitos.' })
  @Transform(({ value }) => value.replace(/\D/g, ''))
  cardNumber: string;

  @ApiProperty({
    description: 'Nome do titular do cartão de crédito',
    example: 'João da Silva',
  })
  @IsNotEmpty({ message: 'O nome do titular do cartão de crédito é obrigatório.' })
  @IsString({ message: 'O nome do titular do cartão de crédito deve ser uma string.' })
  holderName: string;

  @ApiProperty({
    description: 'Mês de validade do cartão de crédito (MM)',
    example: '12',
  })
  @IsNotEmpty({ message: 'O mês de validade é obrigatório.' })
  @IsString({ message: 'O mês de validade deve ser uma string.' })
  @Length(2, 2, { message: 'O mês de validade deve ter 2 dígitos.' })
  expireMonth: string;

  @ApiProperty({
    description: 'Ano de validade do cartão de crédito (AAAA)',
    example: '2025',
  })
  @IsNotEmpty({ message: 'O ano de validade é obrigatório.' })
  @IsString({ message: 'O ano de validade deve ser uma string.' })
  @Length(4, 4, { message: 'O ano de validade deve ter 4 dígitos.' })
  @Min(new Date().getFullYear(), {
    message: 'O ano de validade deve ser maior ou igual ao ano atual.',
  })
  expireYear: string;

  @ApiProperty({
    description: 'CVV do cartão de crédito',
    example: '123',
  })
  @IsNotEmpty({ message: 'O CVV é obrigatório.' })
  @IsString({ message: 'O CVV deve ser uma string.' })
  @Length(3, 3, { message: 'O CVV deve ter 3 dígitos.' })
  cvv: string;
}

export class PayPaymentLinkProfileRequestDto {
  @ApiProperty({
    description: 'CEP do endereço de cobrança',
    example: '12345-678',
  })
  @IsNotEmpty({ message: 'O CEP é obrigatório.' })
  @IsString({ message: 'O CEP deve ser uma string.' })
  zipCode: string;

  @ApiProperty({
    description: 'Endereço de cobrança',
    example: 'Rua das Flores',
  })
  @IsNotEmpty({ message: 'O endereço é obrigatório.' })
  @IsString({ message: 'O endereço deve ser uma string.' })
  streetAddress: string;

  @ApiProperty({
    description: 'Número do endereço de cobrança',
    example: '123',
  })
  @IsNotEmpty({ message: 'O número é obrigatório.' })
  @IsString({ message: 'O número deve ser uma string.' })
  number: string;

  @ApiProperty({
    description: 'Cidade do endereço de cobrança',
    example: 'São Paulo',
  })
  @IsNotEmpty({ message: 'A cidade é obrigatória.' })
  @IsString({ message: 'A cidade deve ser uma string.' })
  cityName: string;

  @ApiProperty({
    description: 'Estado do endereço de cobrança',
    example: 'São Paulo',
  })
  @IsNotEmpty({ message: 'O estado é obrigatório.' })
  @IsString({ message: 'O estado deve ser uma string.' })
  stateName: string;

  @ApiProperty({
    description: 'UF do endereço de cobrança',
    example: 'SP',
  })
  @IsNotEmpty({ message: 'A UF é obrigatória.' })
  @IsString({ message: 'A UF deve ser uma string.' })
  @Length(2, 2, { message: 'A UF deve ter 2 caracteres.' })
  stateUf: string;

  @ApiProperty({
    description: 'Bairro do endereço de cobrança',
    example: 'Jardim das Flores',
  })
  @IsNotEmpty({ message: 'O bairro é obrigatório.' })
  @IsString({ message: 'O bairro deve ser uma string.' })
  neighborhood: string;

  @ApiPropertyOptional({
    description: 'Complemento do endereço de cobrança',
    example: 'Apto 101',
  })
  @IsOptional()
  @IsString({ message: 'O complemento deve ser uma string.' })
  complement: string;

  @ApiProperty({
    description: 'Nome completo do pagador',
    example: 'João da Silva',
  })
  @IsNotEmpty({ message: 'O nome completo é obrigatório.' })
  @IsString({ message: 'O nome completo deve ser uma string.' })
  fullName: string;

  @ApiProperty({
    description: 'E-mail do pagador',
    example: 'pagador@email.com',
    type: String,
  })
  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  @IsString({ message: 'O e-mail deve ser uma string.' })
  @IsEmail({}, { message: 'O e-mail deve ser um endereço de e-mail válido.' })
  email: string;

  @ApiProperty({
    description: 'Telefone do pagador',
    example: '+5511999999999',
  })
  @IsNotEmpty({ message: 'O telefone é obrigatório.' })
  @IsString({ message: 'O telefone deve ser uma string.' })
  phone: string;

  @ApiProperty({
    description: 'CPF ou CNPJ do pagador',
    example: '123.456.789-09',
  })
  @IsNotEmpty({ message: 'O CPF ou CNPJ é obrigatório.' })
  @IsString({ message: 'O CPF ou CNPJ deve ser uma string.' })
  @IsDocument({ message: 'O CPF ou CNPJ deve ser um CPF ou CNPJ válido.' })
  @Transform(({ value }) => removeDocumentMask(value))
  cpfOrCnpj: string;

  @ApiPropertyOptional({
    description: 'Indica se o endereço de cobrança é personalizado',
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'O endereço de cobrança deve ser um booleano.' })
  customBillingAddress: boolean;

  @ApiProperty({
    description: 'Gênero do pagador',
    example: GenderType.MALE,
    enum: GenderType,
  })
  @IsNotEmpty({ message: 'O gênero é obrigatório.' })
  @IsString({ message: 'O gênero deve ser uma string.' })
  @IsEnum(GenderType, { message: 'O gênero deve ser um valor válido.' })
  gender: GenderType;

  @ApiProperty({
    description: 'Data de nascimento do pagador',
    example: '1990-01-01',
  })
  @IsNotEmpty({ message: 'A data de nascimento é obrigatória.' })
  @IsString({ message: 'A data de nascimento deve ser uma string.' })
  @ValidateIf(
    (o) => {
      const birthDate = new Date(o.birthDate);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      return age < 18 || (age === 18 && monthDiff < 0);
    },
    { message: 'O pagador deve ser maior de idade.' },
  )
  @IsDateString({}, { message: 'A data de nascimento deve ser uma data válida.' })
  @Transform(({ value }) => Intl.DateTimeFormat('pt-BR').format(new Date(value)))
  birthDate: string;

  @ApiPropertyOptional({
    description: 'Dados do cartão de crédito',
    type: PayPaymentLinkProfileCreditCardRequestDto,
  })
  @IsOptional()
  @ValidateIf((o) => o.paymentMethod === PaymentMethod.CREDIT_CARD)
  @IsNotEmptyObject({}, { message: 'Os dados do cartão de crédito são obrigatórios.' })
  @ValidateNested({ message: 'Os dados do cartão de crédito devem ser um objeto.' })
  @Type(() => PayPaymentLinkProfileCreditCardRequestDto)
  creditCard?: PayPaymentLinkProfileCreditCardRequestDto;
}

export class PayPaymentLinkRequestDto {
  @ApiProperty({
    description: 'Taxa de câmbio no momento do pagamento',
    example: 5.7671,
    type: Number,
  })
  @IsNotEmpty({ message: 'A taxa de câmbio é obrigatória.' })
  @IsNumber({}, { message: 'A taxa de câmbio deve ser um número.' })
  exchange: number;

  @ApiProperty({
    description: 'Dados do pagador',
    type: PayPaymentLinkProfileRequestDto,
  })
  @IsNotEmptyObject({}, { message: 'Os dados do pagador são obrigatórios.' })
  @ValidateNested({ message: 'Os dados do pagador devem ser um objeto.' })
  @Type(() => PayPaymentLinkProfileRequestDto)
  profile: PayPaymentLinkProfileRequestDto;

  @ApiPropertyOptional({
    description: 'Número de parcelas (caso seja cartão de crédito)',
    example: 3,
    type: Number,
  })
  @ValidateIf((o) => o.paymentMethod === PaymentMethod.CREDIT_CARD)
  @IsNotEmpty({ message: 'O número de parcelas é obrigatório.' })
  @IsNumber(
    { maxDecimalPlaces: 0 },
    { message: 'O número de parcelas deve ser um número.' },
  )
  @IsInt({ message: 'O número de parcelas deve ser um número inteiro.' })
  @Min(1, { message: 'O número de parcelas deve estar entre 1 e 12.' })
  @Max(12, { message: 'O número de parcelas deve estar entre 1 e 12.' })
  installments?: number;

  @Exclude()
  paymentLinkId: string;

  @ApiProperty({
    description: 'Método de pagamento',
    example: PaymentMethod.PIX,
    enum: PaymentMethod,
  })
  @IsNotEmpty({ message: 'O método de pagamento é obrigatório.' })
  @IsString({ message: 'O método de pagamento deve ser uma string.' })
  @IsEnum(PaymentMethod, {
    message: 'O método de pagamento deve ser um valor válido.',
  })
  paymentMethod: PaymentMethod;

  setPaymentLinkId(id: string) {
    this.paymentLinkId = id;
    return this;
  }
}
