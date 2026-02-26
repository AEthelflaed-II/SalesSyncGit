import { Injectable } from '@nestjs/common';
import { ProductRepository } from '@/infra/database/prisma/repositories/product.repository';
import { CreateProductDto } from '../dtos/create-product.dto';

@Injectable()
export class CreateProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(data: CreateProductDto) {
    return this.productRepository.create(data);
  }
}
