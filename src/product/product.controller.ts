import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './product.entity';

@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post()
  create(@Body() productData: Partial<Product>): Promise<Product> {
    return this.productService.createProduct(productData);
  }

  @Get()
  findAll(): Promise<Product[]> {
    return this.productService.findAllProducts();
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<Product> {
    return this.productService.findProductById(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() productData: Partial<Product>,
  ): Promise<Product> {
    return this.productService.updateProduct(+id, productData);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.productService.deleteProduct(+id);
  }
}
