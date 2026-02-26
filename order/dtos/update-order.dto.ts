export class UpdateOrderShippingAddressDto {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export class UpdateOrderShippingDto {
  tracking?: string;
  address: UpdateOrderShippingAddressDto;
}

export class UpdateOrderPersonDto {
  userId?: string;
  name?: string;
}

export class UpdateOrderCustomerDto extends UpdateOrderPersonDto {
  document?: string;
}

export class UpdateOrderRepresentativeDto extends UpdateOrderPersonDto {
  code?: string;
}

export class UpdateOrderDoctorDto extends UpdateOrderPersonDto {
  crm?: string;
}

export class UpdateOrderDto {
  status?: string;
  invoice?: string;
  customer?: UpdateOrderCustomerDto;
  representative?: UpdateOrderRepresentativeDto;
  doctor?: UpdateOrderDoctorDto;
  shipping?: UpdateOrderShippingDto;
  updatedById?: string;
}
