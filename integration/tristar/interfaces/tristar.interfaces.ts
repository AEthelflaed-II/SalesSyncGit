import { type OrderRepository } from '@/infra/database/prisma/repositories/order.repository';
import { PromiseReturnType } from '@/infra/types';

export type RawOrderData = PromiseReturnType<OrderRepository['findOne']>;

type ProductType = RawOrderData['products'][number] & {
  product: { id: string; name: string; description: string; sku: string; hsCode: string };
};

export type OrderData = Omit<RawOrderData, 'products'> & {
  products: ProductType[];
};
