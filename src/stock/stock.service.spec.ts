import { Test, TestingModule } from '@nestjs/testing';
import { StockService } from './stock.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Stock } from './stock.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

const mockStockRepository = () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  find: jest.fn(),
  save: jest.fn(),
});

describe('StockService', () => {
  let service: StockService;
  let repo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StockService,
        {
          provide: getRepositoryToken(Stock),
          useFactory: mockStockRepository,
        },
      ],
    }).compile();

    service = module.get<StockService>(StockService);
    repo = module.get(getRepositoryToken(Stock));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('decreaseStock', () => {
    it('should decrease the stock when enough stock is available', async () => {
      const stockItem = { id: 1, product: { id: 1 }, quantity: 10 };
      repo.findOne.mockResolvedValue(stockItem);

      await service.decreaseStock(1, 5);
      expect(repo.save).toHaveBeenCalledWith({ ...stockItem, quantity: 5 });
    });

    it('should throw a BadRequestException when there is insufficient stock', async () => {
      repo.findOne.mockResolvedValue({
        id: 1,
        product: { id: 1 },
        quantity: 2,
      });

      await expect(service.decreaseStock(1, 5)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('increaseStock', () => {
    it('should increase the stock quantity', async () => {
      const stockItem = { id: 1, product: { id: 1 }, quantity: 2 };
      repo.findOne.mockResolvedValue(stockItem);

      await service.increaseStock(1, 3);
      expect(repo.save).toHaveBeenCalledWith({ ...stockItem, quantity: 5 });
    });

    it('should throw a NotFoundException when the stock item does not exist', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(service.increaseStock(999, 1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getStockItems', () => {
    it('should return an array of stock items', async () => {
      const stockItems = [{ id: 1, product: { id: 1 }, quantity: 10 }];
      repo.find.mockResolvedValue(stockItems);

      expect(await service.getStockItems()).toEqual(stockItems);
    });
  });

  describe('updateStockItem', () => {
    it('should update an existing stock item', async () => {
      const existingStock = { id: 1, product: { id: 1 }, quantity: 5 };
      repo.findOne.mockResolvedValue(existingStock);

      const newQuantity = 10;
      await service.updateStockItem(1, newQuantity);

      expect(repo.save).toHaveBeenCalledWith({
        ...existingStock,
        quantity: newQuantity,
      });
    });

    it('should create a new stock item if it does not exist', async () => {
      repo.findOne.mockResolvedValue(null);
      const productId = 1;
      const quantity = 10;

      await service.updateStockItem(productId, quantity);
      expect(repo.create).toHaveBeenCalledWith({
        product: { id: productId },
        quantity,
      });
      expect(repo.save).toHaveBeenCalled();
    });
  });

  describe('createStockItem', () => {
    it('should create a new stock item', async () => {
      const stockData = { product: { id: 1 }, quantity: 10 };
      repo.create.mockReturnValue(stockData);
      repo.save.mockResolvedValue(stockData);

      const result = await service.createStockItem(1, 10);

      expect(repo.create).toHaveBeenCalledWith(stockData);
      expect(repo.save).toHaveBeenCalledWith(stockData);
      expect(result).toEqual(stockData);
    });
  });
});
