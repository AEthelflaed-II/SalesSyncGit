import { Injectable } from '@nestjs/common';
import { StockProductRepository } from '@/infra/database/prisma/repositories/stock-product.repository';
import { ListStockProductsDto } from '../dtos/list-stock-products.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ListStockProductsService {
  constructor(private readonly stockProductRepository: StockProductRepository) {}

  async execute(
    options: ListStockProductsDto,
    filters?: Prisma.StockProductWhereInput,
    orderBy?:
      | Prisma.StockProductOrderByWithRelationInput
      | Prisma.StockProductOrderByWithRelationInput[],
  ) {
    return this.stockProductRepository.list(options, filters, orderBy);
  }
}
