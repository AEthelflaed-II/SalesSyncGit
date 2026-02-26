import { Injectable } from '@nestjs/common';
import { ProductRepository } from '@/infra/database/prisma/repositories/product.repository';
import { ListProductsDto } from '../dtos/list-products.dto';

@Injectable()
export class ListProductsService {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(options: ListProductsDto) {
    return this.productRepository.list(options);
  }
}
