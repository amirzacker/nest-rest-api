import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShoppingList } from './shoppingList.entity';
import { Product } from '../product/product.entity';

@Injectable()
export class ShoppingListService {
  constructor(
    @InjectRepository(ShoppingList)
    private readonly shoppingListRepository: Repository<ShoppingList>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async addToList(productId: number, quantity: number): Promise<ShoppingList> {
    const product = await this.productRepository.findOneBy({ id: productId });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const newItem = this.shoppingListRepository.create({ product, quantity });
    return this.shoppingListRepository.save(newItem);
  }

  async getList(): Promise<ShoppingList[]> {
    return this.shoppingListRepository.find({ relations: ['product'] });
  }

  async updateItem(id: number, quantity: number): Promise<ShoppingList> {
    const item = await this.shoppingListRepository.findOneBy({ id });
    if (!item) {
      throw new NotFoundException('Item not found');
    }
    item.quantity = quantity;
    return this.shoppingListRepository.save(item);
  }

  async removeItem(id: number): Promise<void> {
    const result = await this.shoppingListRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Item not found or already removed');
    }
  }
}
