import {
  Body,
  Controller,
  Delete,
  Post,
  Param,
  Get,
  Put,
} from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Post()
  addToCart(@Body() addToCartDto: { productId: number; quantity: number }) {
    return this.cartService.addToCart(
      addToCartDto.productId,
      addToCartDto.quantity,
    );
  }

  @Delete(':id')
  removeFromCart(@Param('id') cartId: string) {
    return this.cartService.removeFromCart(parseInt(cartId));
  }

  // Ajouts dans CartController

  @Get()
  getAllCartItems() {
    return this.cartService.getCartItems();
  }

  @Put(':id')
  updateCartItem(
    @Param('id') cartId: string,
    @Body() updateCartDto: { quantity: number },
  ) {
    return this.cartService.updateCartItem(
      parseInt(cartId),
      updateCartDto.quantity,
    );
  }
}
