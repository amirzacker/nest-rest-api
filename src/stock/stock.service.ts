import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stock } from './stock.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock)
    private stockRepository: Repository<Stock>,
  ) {}

  async decreaseStock(productId: number, quantity: number): Promise<void> {
    const stockItem = await this.stockRepository.findOne({
      where: { product: { id: productId } },
    });
    if (!stockItem || stockItem.quantity < quantity) {
      throw new BadRequestException('Insufficient stock');
    }
    stockItem.quantity -= quantity;
    await this.stockRepository.save(stockItem);
  }

  async increaseStock(productId: number, quantity: number): Promise<void> {
    const stockItem = await this.stockRepository.findOne({
      where: { product: { id: productId } },
    });
    if (!stockItem) {
      throw new NotFoundException(`Stock with ID ${productId} not found`);
    }
    stockItem.quantity += quantity;
    await this.stockRepository.save(stockItem);
  }

  // Ajouts dans StockService

  async getStockItems(): Promise<Stock[]> {
    return this.stockRepository.find({ relations: ['product'] });
  }

  async updateStockItem(
    productId: number,
    newQuantity: number,
  ): Promise<Stock> {
    let stockItem = await this.stockRepository.findOne({
      where: { product: { id: productId } },
    });
    if (!stockItem) {
      stockItem = this.stockRepository.create({
        product: { id: productId },
        quantity: newQuantity,
      });
    } else {
      stockItem.quantity = newQuantity;
    }
    return this.stockRepository.save(stockItem);
  }

  async createStockItem(productId: number, quantity: number): Promise<Stock> {
    const stockItem = this.stockRepository.create({
      product: { id: productId },
      quantity,
    });
    return this.stockRepository.save(stockItem);
  }
}
