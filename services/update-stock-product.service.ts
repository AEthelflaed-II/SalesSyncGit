import { Injectable } from '@nestjs/common';
import { NotFoundError } from '@/common/errors/not-found.error';
import { StockProductRepository } from '@/infra/database/prisma/repositories/stock-product.repository';
import { ResourceBaseParams } from '@/infra/base/interfaces/request-params.interfaces';
import { UpdateStockProductDto } from '../dtos/update-stock-product.dto';

@Injectable()
export class UpdateStockProductService {
  constructor(private readonly stockProductRepository: StockProductRepository) {}

  async execute({ id }: ResourceBaseParams, data: UpdateStockProductDto) {
    const product = await this.stockProductRepository.findOne(id);
    if (!product) {
      throw new NotFoundError({
        module: 'Product',
        code: 'S.USP.01',
        message: 'Produto não encontrado.',
      });
    }

    await this.stockProductRepository.update(id, data);
  }
}
