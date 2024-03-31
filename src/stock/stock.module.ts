import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { Stock } from './stock.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/product/product.entity';
import { ProductService } from 'src/product/product.service';

@Module({
  imports: [TypeOrmModule.forFeature([Stock, Product])],
  providers: [StockService, ProductService],
  controllers: [StockController],
})
export class StockModule {}
