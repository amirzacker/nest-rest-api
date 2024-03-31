import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './cart.entity';
import { StockService } from '../stock/stock.service';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    private stockService: StockService,
  ) {}

  async addToCart(productId: number, quantity: number): Promise<Cart> {
    // Diminuez le stock avant d'ajouter au caddie
    await this.stockService.decreaseStock(productId, quantity);

    const newCartItem = this.cartRepository.create({
      product: { id: productId },
      quantity,
    });
    return this.cartRepository.save(newCartItem);
  }

  async removeFromCart(cartId: number): Promise<void> {
    const cartItem = await this.cartRepository.findOne({
      where: { id: cartId },
      relations: ['product'],
    });
    if (!cartItem) throw new NotFoundException('Cart item not found');

    // Augmentez le stock après avoir retiré du caddie
    await this.stockService.increaseStock(
      cartItem.product.id,
      cartItem.quantity,
    );

    await this.cartRepository.remove(cartItem);
  }

  // Ajouts dans CartService

  async getCartItems(): Promise<Cart[]> {
    return this.cartRepository.find({ relations: ['product'] });
  }

  async updateCartItem(cartId: number, quantity: number): Promise<Cart> {
    const cartItem = await this.cartRepository.findOne({
      where: { id: cartId },
      relations: ['product'],
    });
    if (!cartItem) throw new NotFoundException('Cart item not found');

    // Ajustez le stock en fonction de la nouvelle quantité
    const quantityDifference = cartItem.quantity - quantity;
    if (quantityDifference > 0) {
      await this.stockService.increaseStock(
        cartItem.product.id,
        quantityDifference,
      );
    } else if (quantityDifference < 0) {
      await this.stockService.decreaseStock(
        cartItem.product.id,
        -quantityDifference,
      );
    }

    cartItem.quantity = quantity;
    return this.cartRepository.save(cartItem);
  }
}
