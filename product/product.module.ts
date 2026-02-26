import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DatabaseModule } from '@/infra/database/database.module';
import { EnsureAuthMiddleware } from '../auth/middlewares/ensure-auth.middleware';
import { ProductRepository } from '@/infra/database/prisma/repositories/product.repository';
import { CreateProductController } from '@/api/product/controllers/create-product.controller';
import { FindProductController } from '@/api/product/controllers/find-product.controller';
import { ListProductsController } from '@/api/product/controllers/list-products.controller';
import { UpdateProductController } from '@/api/product/controllers/update-product.controller';
import { DeleteProductController } from '@/api/product/controllers/delete-product.controller';
import { CreateProductService } from './services/create-product.service';
import { FindProductService } from './services/find-product.service';
import { ListProductsService } from './services/list-products.service';
import { UpdateProductService } from './services/update-product.service';
import { DeleteProductService } from './services/delete-product.service';

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateProductController,
    FindProductController,
    ListProductsController,
    UpdateProductController,
    DeleteProductController,
  ],
  providers: [
    ProductRepository,
    CreateProductService,
    FindProductService,
    ListProductsService,
    UpdateProductService,
    DeleteProductService,
  ],
})
export class ProductModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(EnsureAuthMiddleware)
      .forRoutes(
        CreateProductController,
        FindProductController,
        ListProductsController,
        UpdateProductController,
        DeleteProductController,
      );
  }
}
