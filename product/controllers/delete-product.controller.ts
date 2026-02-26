import { Controller, Param, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeleteProductService } from '@app/product/services/delete-product.service';
import { ResourceBaseParams } from '@/infra/base/interfaces/request-params.interfaces';

@ApiTags('Produtos')
@ApiBearerAuth()
@Controller('/products')
export class DeleteProductController {
  constructor(private readonly deleteProduct: DeleteProductService) {}

  @Delete('/:id')
  @ApiOperation({
    summary: 'Excluir produto',
    description: 'Exclui definitivamente um produto da plataforma.',
  })
  async handle(@Param() { id }: ResourceBaseParams) {
    return this.deleteProduct.execute({ id });
  }
}
