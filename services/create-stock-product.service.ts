import { Injectable } from '@nestjs/common';
import { NotFoundError } from '@/common/errors/not-found.error';
import { StockRepository } from '@/infra/database/prisma/repositories/stock.repository';
import { ProductRepository } from '@/infra/database/prisma/repositories/product.repository';
import { StockProductRepository } from '@/infra/database/prisma/repositories/stock-product.repository';
import { CreateStockProductDto } from '../dtos/create-stock-product.dto';

@Injectable()
export class CreateStockProductService {
  constructor(
    private readonly stockRepository: StockRepository,
    private readonly productRepository: ProductRepository,
    private readonly stockProductRepository: StockProductRepository,
  ) {}

  async execute(data: CreateStockProductDto) {
    const stock = await this.stockRepository.findOne(data.stockId);
    if (!stock) {
      throw new NotFoundError({
        module: 'StockProduct',
        code: 'S.CSP.01',
        message: 'Estoque não encontrado.',
      });
    }

    const product = await this.productRepository.findOne(data.productId);
    if (!product) {
      throw new NotFoundError({
        module: 'StockProduct',
        code: 'S.CSP.02',
        message: 'Produto não encontrado.',
      });
    }

    return this.stockProductRepository.create(data);
  }
}
