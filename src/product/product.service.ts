import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  createProduct(productData: Partial<Product>): Promise<Product> {
    const product = this.productRepository.create(productData);
    return this.productRepository.save(product);
  }

  findAllProducts(): Promise<Product[]> {
    return this.productRepository.find();
  }

  findProductById(id: number): Promise<Product> {
    return this.productRepository.findOneBy({ id });
  }

  async updateProduct(
    id: number,
    productData: Partial<Product>,
  ): Promise<Product> {
    const product = await this.findProductById(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    Object.assign(product, productData);
    return this.productRepository.save(product);
  }

  async deleteProduct(id: number): Promise<void> {
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(
        `Product with ID ${id} not found or already removed`,
      );
    }
  }
}
