import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ShoppingListService } from './shopping-list.service';
import { ShoppingList } from './shoppingList.entity';

@Controller('shopping-list')
export class ShoppingListController {
  constructor(private readonly shoppingListService: ShoppingListService) {}

  @Post()
  addToList(
    @Body() addItemDto: { productId: number; quantity: number },
  ): Promise<ShoppingList> {
    return this.shoppingListService.addToList(
      addItemDto.productId,
      addItemDto.quantity,
    );
  }

  @Get()
  getList(): Promise<ShoppingList[]> {
    return this.shoppingListService.getList();
  }

  @Put(':id')
  updateItem(
    @Param('id') id: string,
    @Body() updateItemDto: { quantity: number },
  ): Promise<ShoppingList> {
    return this.shoppingListService.updateItem(+id, updateItemDto.quantity);
  }

  @Delete(':id')
  removeItem(@Param('id') id: string): Promise<void> {
    return this.shoppingListService.removeItem(+id);
  }
}
