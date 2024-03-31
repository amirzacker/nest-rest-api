import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';
import { ShoppingListModule } from './shopping-list/shopping-list.module';
import { StockModule } from './stock/stock.module';
import { Product } from './product/product.entity';
import { Cart } from './cart/cart.entity';
import { Stock } from './stock/stock.entity';
import { ShoppingList } from './shopping-list/shoppingList.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'amir',
      password: 'amircentre',
      database: 'shopping_list_db',
      entities: [Product, Cart, Stock, ShoppingList],
      synchronize: true, // Use only in development!
    }),
    ProductModule,
    CartModule,
    ShoppingListModule,
    StockModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
