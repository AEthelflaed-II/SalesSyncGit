import { Controller, Body, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateProductService } from '@app/product/services/create-product.service';
import { CreateProductDto } from '@app/product/dtos/create-product.dto';

@ApiTags('Produtos')
@ApiBearerAuth()
@Controller('/products')
export class CreateProductController {
  constructor(private readonly createProduct: CreateProductService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar produto',
    description: 'Cria um produto na plataforma.',
  })
  async handle(@Body() data: CreateProductDto) {
    return this.createProduct.execute(data);
  }
}
