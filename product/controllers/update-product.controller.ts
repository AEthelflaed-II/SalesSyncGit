import { Controller, Body, Param, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateProductService } from '@app/product/services/update-product.service';
import { UpdateProductDto } from '@app/product/dtos/update-product.dto';
import { ResourceBaseParams } from '@/infra/base/interfaces/request-params.interfaces';

@ApiTags('Produtos')
@ApiBearerAuth()
@Controller('/products')
export class UpdateProductController {
  constructor(private readonly updateProduct: UpdateProductService) {}

  @Put('/:id')
  @ApiOperation({
    summary: 'Atualizar produto',
    description: 'Atualiza um produto existente.',
  })
  async handle(
    @Param() { id }: ResourceBaseParams,
    @Body() data: UpdateProductDto,
  ) {
    return this.updateProduct.execute({ id }, data);
  }
}
