import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './cart.entity';
import { StockService } from '../stock/stock.service';
import { Stock } from 'src/stock/stock.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, Stock])],
  providers: [CartService, StockService],
  controllers: [CartController],
})
export class CartModule {}
