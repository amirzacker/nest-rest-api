import { Test, TestingModule } from '@nestjs/testing';
import { ShoppingListService } from './shopping-list.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ShoppingList } from './shoppingList.entity';
import { Product } from '../product/product.entity';

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

describe('ShoppingListService', () => {
  let service: ShoppingListService;
  let shoppingListRepository;
  let productRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShoppingListService,
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

    service = module.get<ShoppingListService>(ShoppingListService);
    shoppingListRepository = module.get(getRepositoryToken(ShoppingList));
    productRepository = module.get(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addToList', () => {
    it('should add a product to the shopping list', async () => {
      const productId = 1;
      const quantity = 2;
      const product = { id: productId, name: 'Test Product', price: 10 };
      const newItem = { id: 1, product, quantity };

      productRepository.findOneBy.mockResolvedValue(product);
      shoppingListRepository.create.mockReturnValue(newItem);
      shoppingListRepository.save.mockResolvedValue(newItem);

      const result = await service.addToList(productId, quantity);

      expect(productRepository.findOneBy).toHaveBeenCalledWith({
        id: productId,
      });
      expect(shoppingListRepository.create).toHaveBeenCalledWith({
        product,
        quantity,
      });
      expect(shoppingListRepository.save).toHaveBeenCalledWith(newItem);
      expect(result).toEqual(newItem);
    });
  });

  describe('getList', () => {
    it('should retrieve the shopping list', async () => {
      const shoppingList = [{ id: 1, product: { id: 1 }, quantity: 2 }];
      shoppingListRepository.find.mockResolvedValue(shoppingList);

      const result = await service.getList();

      expect(shoppingListRepository.find).toHaveBeenCalled();
      expect(result).toEqual(shoppingList);
    });
  });

  describe('updateItem', () => {
    it('should update a product quantity in the shopping list', async () => {
      const itemId = 1;
      const newQuantity = 3;
      const item = { id: itemId, product: { id: 1 }, quantity: 2 };
      shoppingListRepository.findOneBy.mockResolvedValue(item);
      shoppingListRepository.save.mockResolvedValue({
        ...item,
        quantity: newQuantity,
      });

      const result = await service.updateItem(itemId, newQuantity);

      expect(shoppingListRepository.findOneBy).toHaveBeenCalledWith({
        id: itemId,
      });
      expect(shoppingListRepository.save).toHaveBeenCalledWith({
        ...item,
        quantity: newQuantity,
      });
      expect(result).toEqual({ ...item, quantity: newQuantity });
    });
  });

  describe('removeItem', () => {
    it('should remove an item from the shopping list', async () => {
      const itemId = 1;
      shoppingListRepository.delete.mockResolvedValue({ affected: 1 });

      await service.removeItem(itemId);

      expect(shoppingListRepository.delete).toHaveBeenCalledWith(itemId);
    });
  });
});
