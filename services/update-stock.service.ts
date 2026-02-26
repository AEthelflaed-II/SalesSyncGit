import { Injectable } from '@nestjs/common';
import { NotFoundError } from '@/common/errors/not-found.error';
import { StockRepository } from '@/infra/database/prisma/repositories/stock.repository';
import { ResourceBaseParams } from '@/infra/base/interfaces/request-params.interfaces';
import { UpdateStockDto } from '../dtos/update-stock.dto';

@Injectable()
export class UpdateStockService {
  constructor(private readonly stockRepository: StockRepository) {}

  async execute({ id }: ResourceBaseParams, data: UpdateStockDto) {
    const stock = await this.stockRepository.findOne(id);
    if (!stock) {
      throw new NotFoundError({
        module: 'Stock',
        code: 'S.US.01',
        message: 'Estoque não encontrado.',
      });
    }

    await this.stockRepository.update(id, data);
  }
}
