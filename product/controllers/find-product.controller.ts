import { Controller, Param, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FindProductService } from '@app/product/services/find-product.service';
import { ResourceBaseParams } from '@/infra/base/interfaces/request-params.interfaces';

@ApiTags('Produtos')
@ApiBearerAuth()
@Controller('/products')
export class FindProductController {
  constructor(private readonly findProduct: FindProductService) {}

  @Get('/find/:id')
  @ApiOperation({
    summary: 'Visualizar detalhes de produto',
    description: 'Visualiza os detalhes de um produto existente.',
  })
  async handle(@Param() { id }: ResourceBaseParams) {
    return this.findProduct.execute({ id });
  }
}
