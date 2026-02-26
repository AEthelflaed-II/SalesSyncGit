import { Injectable } from '@nestjs/common';
import { NotFoundError } from '@/common/errors/not-found.error';
import { StockProductRepository } from '@/infra/database/prisma/repositories/stock-product.repository';
import { ResourceBaseParams } from '@/infra/base/interfaces/request-params.interfaces';

@Injectable()
export class DeleteStockProductService {
  constructor(private readonly stockProductRepository: StockProductRepository) {}

  async execute({ id }: ResourceBaseParams) {
    const product = await this.stockProductRepository.findOne(id);
    if (!product) {
      throw new NotFoundError({
        module: 'Product',
        code: 'S.DSP.01',
        message: 'Produto não encontrado.',
      });
    }

    return this.stockProductRepository.delete(id);
  }
}
