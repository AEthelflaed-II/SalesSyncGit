import { Injectable } from '@nestjs/common';
import { StockRepository } from '@/infra/database/prisma/repositories/stock.repository';
import { CreateStockDto } from '../dtos/create-stock.dto';

@Injectable()
export class CreateStockService {
  constructor(private readonly stockRepository: StockRepository) {}

  async execute(data: CreateStockDto) {
    return this.stockRepository.create(data);
  }
}
