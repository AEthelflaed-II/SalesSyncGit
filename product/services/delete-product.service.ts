import { Injectable } from '@nestjs/common';
import { NotFoundError } from '@/common/errors/not-found.error';
import { ProductRepository } from '@/infra/database/prisma/repositories/product.repository';
import { ResourceBaseParams } from '@/infra/base/interfaces/request-params.interfaces';

@Injectable()
export class DeleteProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute({ id }: ResourceBaseParams) {
    const product = await this.productRepository.findOne(id);
    if (!product) {
      throw new NotFoundError({
        module: 'Product',
        code: 'S.PD.0001',
        message: 'Produto não encontrado.',
      });
    }

    return this.productRepository.delete(id);
  }
}
