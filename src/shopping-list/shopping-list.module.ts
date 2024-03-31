import { Module } from '@nestjs/common';
import { ShoppingListController } from './shopping-list.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShoppingList } from './shoppingList.entity';
import { ShoppingListService } from './shopping-list.service';
import { Product } from 'src/product/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShoppingList, Product])],
  controllers: [ShoppingListController],
  providers: [ShoppingListService],
})
export class ShoppingListModule {}
