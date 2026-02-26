import { Injectable } from '@nestjs/common';
import { NotFoundError } from '@/common/errors/not-found.error';
import { StockRepository } from '@/infra/database/prisma/repositories/stock.repository';
import { ResourceBaseParams } from '@/infra/base/interfaces/request-params.interfaces';

@Injectable()
export class FindStockService {
  constructor(private readonly stockRepository: StockRepository) {}

  async execute({ id }: ResourceBaseParams) {
    const stock = await this.stockRepository.findOne(id);
    if (!stock) {
      throw new NotFoundError({
        module: 'Stock',
        code: 'S.FS.01',
        message: 'Estoque não encontrado.',
      });
    }

    return stock;
  }
}
