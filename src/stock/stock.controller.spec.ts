import { Test, TestingModule } from '@nestjs/testing';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';

const mockStockService = {
  decreaseStock: jest.fn(),
  increaseStock: jest.fn(),
  getStockItems: jest.fn(),
  updateStockItem: jest.fn(),
  createStockItem: jest.fn(),
};

describe('StockController', () => {
  let controller: StockController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockController],
      providers: [
        {
          provide: StockService,
          useValue: mockStockService,
        },
      ],
    }).compile();

    controller = module.get<StockController>(StockController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // CRUD operation tests go here
  describe('getAllStockItems', () => {
    it('should return an array of stock items', async () => {
      const stockItems = [{ productId: 1, quantity: 100 }];
      mockStockService.getStockItems.mockResolvedValue(stockItems);

      expect(await controller.getAllStockItems()).toEqual(stockItems);
      expect(mockStockService.getStockItems).toHaveBeenCalled();
    });
  });

  describe('updateStockItem', () => {
    it('should update a stock item', async () => {
      const productId = 1;
      const newQuantity = 150;
      const updatedStockItem = { productId, quantity: newQuantity };
      mockStockService.updateStockItem.mockResolvedValue(updatedStockItem);

      expect(
        await controller.updateStockItem(productId.toString(), {
          quantity: newQuantity,
        }),
      ).toEqual(updatedStockItem);
      expect(mockStockService.updateStockItem).toHaveBeenCalledWith(
        productId,
        newQuantity,
      );
    });
  });

  describe('addStockItem', () => {
    it('should add a stock item', async () => {
      const productId = 1;
      const quantity = 100;
      const newStockItem = { productId, quantity };
      mockStockService.createStockItem.mockResolvedValue(newStockItem);

      expect(await controller.addStockItem({ productId, quantity })).toEqual(
        newStockItem,
      );
      expect(mockStockService.createStockItem).toHaveBeenCalledWith(
        productId,
        quantity,
      );
    });
  });
});
