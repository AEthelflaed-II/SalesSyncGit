import { Injectable } from '@nestjs/common';
import { StockRepository } from '@/infra/database/prisma/repositories/stock.repository';
import { ListStocksDto } from '../dtos/list-stocks.dto';

@Injectable()
export class ListStocksService {
  constructor(private readonly stockRepository: StockRepository) {}

  async execute(options: ListStocksDto) {
    return this.stockRepository.list(options);
  }
}
