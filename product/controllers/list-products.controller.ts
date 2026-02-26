import { Controller, Query, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ListProductsService } from '@app/product/services/list-products.service';
import { ListProductsDto } from '@app/product/dtos/list-products.dto';

@ApiTags('Produtos')
@ApiBearerAuth()
@Controller('/products')
export class ListProductsController {
  constructor(private readonly listProducts: ListProductsService) {}

  @Get('/all')
  @ApiOperation({
    summary: 'Listar produtos cadastrados',
    description:
      'Lista os produtos cadastrados com possibilidade de paginação e filtros.',
  })
  async handle(@Query() filters: ListProductsDto) {
    return this.listProducts.execute(filters);
  }
}
