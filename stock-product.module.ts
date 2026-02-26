import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DatabaseModule } from '@/infra/database/database.module';
import { StockRepository } from '@/infra/database/prisma/repositories/stock.repository';
import { StockProductRepository } from '@/infra/database/prisma/repositories/stock-product.repository';
import { ProductRepository } from '@/infra/database/prisma/repositories/product.repository';
import { CreateStockProductController } from '@/api/stock-product/controllers/create-stock-product.controller';
import { FindStockProductController } from '@/api/stock-product/controllers/find.stock-product.controller';
import { ListStockProductsController } from '@/api/stock-product/controllers/list-stock-products.controller';
import { UpdateStockProductController } from '@/api/stock-product/controllers/update-stock-product.controller';
import { DeleteStockProductController } from '@/api/stock-product/controllers/delete-stock-product.controller';
import { CreateStockProductService } from './services/create-stock-product.service';
import { FindStockProductService } from './services/find-stock-product.service';
import { ListStockProductsService } from './services/list-stock-products.service';
import { UpdateStockProductService } from './services/update-stock-product.service';
import { DeleteStockProductService } from './services/delete-stock-product.service';
import { EnsureAuthMiddleware } from '../auth/middlewares/ensure-auth.middleware';

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateStockProductController,
    FindStockProductController,
    ListStockProductsController,
    UpdateStockProductController,
    DeleteStockProductController,
  ],
  providers: [
    StockRepository,
    StockProductRepository,
    ProductRepository,
    CreateStockProductService,
    FindStockProductService,
    ListStockProductsService,
    UpdateStockProductService,
    DeleteStockProductService,
  ],
})
export class StockProductModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(EnsureAuthMiddleware)
      .forRoutes(
        CreateStockProductController,
        FindStockProductController,
        ListStockProductsController,
        UpdateStockProductController,
        DeleteStockProductController,
      );
  }
}
