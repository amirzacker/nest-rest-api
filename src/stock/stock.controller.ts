// src/stock/stock.controller.ts
import { Body, Controller, Get, Param, Put, Post } from '@nestjs/common';
import { StockService } from './stock.service';

@Controller('stock')
export class StockController {
  constructor(private stockService: StockService) {}

  @Get()
  getAllStockItems() {
    return this.stockService.getStockItems();
  }

  @Put(':productId')
  updateStockItem(
    @Param('productId') productId: string,
    @Body() updateStockDto: { quantity: number },
  ) {
    return this.stockService.updateStockItem(
      parseInt(productId),
      updateStockDto.quantity,
    );
  }
  @Post()
  addStockItem(@Body() addStockDto: { productId: number; quantity: number }) {
    return this.stockService.createStockItem(
      addStockDto.productId,
      addStockDto.quantity,
    );
  }
}
