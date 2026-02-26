import { Injectable } from '@nestjs/common';
import { NotFoundError } from '@/common/errors/not-found.error';
import { ProductRepository } from '@/infra/database/prisma/repositories/product.repository';
import { ResourceBaseParams } from '@/infra/base/interfaces/request-params.interfaces';
import { UpdateProductDto } from '../dtos/update-product.dto';

@Injectable()
export class UpdateProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute({ id }: ResourceBaseParams, data: UpdateProductDto) {
    const product = await this.productRepository.findOne(id);
    if (!product) {
      throw new NotFoundError({
        module: 'Product',
        code: 'S.PU.0001',
        message: 'Produto não encontrado.',
      });
    }

    await this.productRepository.update(id, data);
  }
}
