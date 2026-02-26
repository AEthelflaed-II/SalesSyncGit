import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DatabaseModule } from '@/infra/database/database.module';
import { CreateStockService } from './services/create-stock.service';
import { FindStockService } from './services/find-stock.service';
import { ListStocksService } from './services/list-stocks.service';
import { UpdateStockService } from './services/update-stock.service';
import { DeleteStockService } from './services/delete-stock.service';
import { StockRepository } from '@/infra/database/prisma/repositories/stock.repository';
import { CreateStockController } from '@/api/stock/controllers/create-stock.controller';
import { FindStockController } from '@/api/stock/controllers/find-stock.controller';
import { ListStocksController } from '@/api/stock/controllers/list-stocks.controller';
import { UpdateStockController } from '@/api/stock/controllers/update-stock.controller';
import { DeleteStockController } from '@/api/stock/controllers/delete-stock.controller';
import { EnsureAuthMiddleware } from '../auth/middlewares/ensure-auth.middleware';

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateStockController,
    FindStockController,
    ListStocksController,
    UpdateStockController,
    DeleteStockController,
  ],
  providers: [
    StockRepository,
    CreateStockService,
    FindStockService,
    ListStocksService,
    UpdateStockService,
    DeleteStockService,
  ],
})
export class StockModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(EnsureAuthMiddleware)
      .forRoutes(
        CreateStockController,
        FindStockController,
        ListStocksController,
        UpdateStockController,
        DeleteStockController,
      );
  }
}
