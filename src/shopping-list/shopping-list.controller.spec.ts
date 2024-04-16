import { Test, TestingModule } from '@nestjs/testing';
import { ShoppingListController } from './shopping-list.controller';
import { ShoppingListService } from './shopping-list.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ShoppingList } from './shoppingList.entity';
import { Product } from '../product/product.entity';

const mockShoppingListService = {
  addToList: jest.fn(),
  getList: jest.fn(),
  updateItem: jest.fn(),
  removeItem: jest.fn(),
};

const mockShoppingListRepository = () => ({
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  delete: jest.fn(),
});

const mockProductRepository = () => ({
  findOneBy: jest.fn(),
});

describe('ShoppingListController', () => {
  let controller: ShoppingListController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShoppingListController],
      providers: [
        {
          provide: ShoppingListService,
          useValue: mockShoppingListService,
        },
        {
          provide: getRepositoryToken(ShoppingList),
          useFactory: mockShoppingListRepository,
        },
        {
          provide: getRepositoryToken(Product),
          useFactory: mockProductRepository,
        },
      ],
    }).compile();

    controller = module.get<ShoppingListController>(ShoppingListController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addToList', () => {
    it('should call the ShoppingListService.addToList method with expected params', async () => {
      const mockProductDto = { productId: 1, quantity: 2 };
      const mockShoppingListItem = {
        id: 1,
        product: { id: 1, name: 'Test Product', price: 100 },
        quantity: 2,
      };

      mockShoppingListService.addToList.mockResolvedValue(mockShoppingListItem);

      const result = await controller.addToList(mockProductDto);

      expect(mockShoppingListService.addToList).toHaveBeenCalledWith(
        mockProductDto.productId,
        mockProductDto.quantity,
      );
      expect(result).toEqual(mockShoppingListItem);
    });
  });

  describe('getList', () => {
    it('should retrieve the shopping list from the service', async () => {
      const mockShoppingList = [
        {
          id: 1,
          product: { id: 1, name: 'Test Product', price: 100 },
          quantity: 2,
        },
      ];

      mockShoppingListService.getList.mockResolvedValue(mockShoppingList);

      const result = await controller.getList();

      expect(mockShoppingListService.getList).toHaveBeenCalled();
      expect(result).toEqual(mockShoppingList);
    });
  });

  describe('updateItem', () => {
    it('should update an item in the shopping list', async () => {
      const itemId = 1;
      const updateDto = { quantity: 3 };
      const updatedItem = {
        id: itemId,
        product: { id: 1, name: 'Test Product', price: 100 },
        quantity: 3,
      };

      mockShoppingListService.updateItem.mockResolvedValue(updatedItem);

      const result = await controller.updateItem(String(itemId), updateDto);

      expect(mockShoppingListService.updateItem).toHaveBeenCalledWith(
        itemId,
        updateDto.quantity,
      );
      expect(result).toEqual(updatedItem);
    });
  });

  describe('removeItem', () => {
    it('should remove an item from the shopping list', async () => {
      const itemId = 1;
      mockShoppingListService.removeItem.mockResolvedValue(itemId);

      await controller.removeItem(String(itemId));

      expect(mockShoppingListService.removeItem).toHaveBeenCalledWith(itemId);
    });
  });
});
