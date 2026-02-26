import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { NotFoundError } from '@/common/errors/not-found.error';
import { StockProductRepository } from '@/infra/database/prisma/repositories/stock-product.repository';
import { ResourceBaseParams } from '@/infra/base/interfaces/request-params.interfaces';

@Injectable()
export class FindStockProductService {
  constructor(private readonly stockProductRepository: StockProductRepository) {}

  async execute({ id }: ResourceBaseParams) {
    const product = await this.stockProductRepository.findOne(id);
    if (!product) {
      throw new NotFoundError({
        module: 'Product',
        code: 'S.FSP.01',
        message: 'Produto não encontrado.',
      });
    }

    return product;
  }

  async findFirstByProductId(
    productId: string,
    orderBy?: Prisma.StockProductOrderByWithRelationInput,
  ) {
    const product = await this.stockProductRepository.findFirstByProductId(
      productId,
      null,
      orderBy,
    );

    if (!product) {
      throw new NotFoundError({
        module: 'Product',
        code: 'S.FSP.02',
        message: 'Produto não encontrado.',
      });
    }

    return product;
  }
}
