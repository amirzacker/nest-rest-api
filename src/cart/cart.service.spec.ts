import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Cart } from './cart.entity';
import { StockService } from '../stock/stock.service';

const mockCartRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  remove: jest.fn(),
};

const mockStockService = {
  decreaseStock: jest.fn(),
  increaseStock: jest.fn(),
};

describe('CartService', () => {
  let service: CartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: getRepositoryToken(Cart),
          useValue: mockCartRepository,
        },
        {
          provide: StockService,
          useValue: mockStockService,
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Additional tests will be here
  describe('addToCart', () => {
    it('should add an item to the cart and decrease stock', async () => {
      const productId = 1;
      const quantity = 2;
      const cartItem = { id: 1, product: { id: productId }, quantity };

      mockCartRepository.create.mockReturnValue(cartItem);
      mockCartRepository.save.mockResolvedValue(cartItem);
      mockStockService.decreaseStock.mockResolvedValue(undefined);

      const result = await service.addToCart(productId, quantity);

      expect(mockStockService.decreaseStock).toHaveBeenCalledWith(
        productId,
        quantity,
      );
      expect(mockCartRepository.create).toHaveBeenCalledWith({
        product: { id: productId },
        quantity,
      });
      expect(mockCartRepository.save).toHaveBeenCalledWith(cartItem);
      expect(result).toEqual(cartItem);
    });
  });

  describe('getCartItems', () => {
    it('should retrieve all items from the cart', async () => {
      const cartItems = [{ id: 1, product: { id: 1 }, quantity: 2 }];

      mockCartRepository.find.mockResolvedValue(cartItems);

      const result = await service.getCartItems();

      expect(mockCartRepository.find).toHaveBeenCalled();
      expect(result).toEqual(cartItems);
    });
  });

  describe('updateCartItem', () => {
    it('should update an item quantity and adjust stock accordingly', async () => {
      const cartId = 1;
      const newQuantity = 1;
      const existingCartItem = { id: cartId, product: { id: 1 }, quantity: 2 };

      mockCartRepository.findOne.mockResolvedValue(existingCartItem);
      mockCartRepository.save.mockResolvedValue({
        ...existingCartItem,
        quantity: newQuantity,
      });

      const result = await service.updateCartItem(cartId, newQuantity);

      expect(mockCartRepository.save).toHaveBeenCalledWith({
        ...existingCartItem,
        quantity: newQuantity,
      });
      expect(result.quantity).toEqual(newQuantity);
    });
  });

  describe('removeFromCart', () => {
    it('should remove an item from the cart and increase stock', async () => {
      const cartId = 1;
      const cartItem = { id: cartId, product: { id: 1 }, quantity: 2 };

      mockCartRepository.findOne.mockResolvedValue(cartItem);
      mockCartRepository.remove.mockResolvedValue(undefined);
      mockStockService.increaseStock.mockResolvedValue(undefined);

      await service.removeFromCart(cartId);

      expect(mockStockService.increaseStock).toHaveBeenCalledWith(1, 2);
      expect(mockCartRepository.remove).toHaveBeenCalledWith(cartItem);
    });
  });
});
