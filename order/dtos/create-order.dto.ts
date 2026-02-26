import { OrderStatus } from '../enums/order.enum';

export class CreateOrderProductDto {
  stockProductId: string;
  quantity: number;
  price: number;
  discount: number;
}

export class CreateOrderShippingAddressDto {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export class CreateOrderShippingDto {
  tracking?: string;
  price?: number;
  insurance?: boolean;
  insuranceValue?: number;
  address: CreateOrderShippingAddressDto;
}

export class CreateOrderCustomerDto {
  userId: string;
  name: string;
  document: string;
}

export class CreateOrderRepresentativeDto {
  userId: string;
  name: string;
  code: string;
}

export class CreateOrderDoctorDto {
  userId: string;
  name: string;
  crm: string;
}

export class CreateOrderDto {
  status: OrderStatus;
  invoice: string;
  currency: string;
  amount: number;
  discount: number;
  customer: CreateOrderCustomerDto;
  representative: CreateOrderRepresentativeDto;
  doctor: CreateOrderDoctorDto;
  products: CreateOrderProductDto[];
  shipping: CreateOrderShippingDto;
  createdById: string;
}
