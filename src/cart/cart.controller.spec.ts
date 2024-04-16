import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';

const mockCartService = {
  addToCart: jest.fn(),
  getCartItems: jest.fn(),
  updateCartItem: jest.fn(),
  removeFromCart: jest.fn(),
};

const mockStockService = {
  decreaseStock: jest.fn(),
  increaseStock: jest.fn(),
  getStockItems: jest.fn(),
  updateStockItem: jest.fn(),
  createStockItem: jest.fn(),
};

const mockStockRepository = () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  delete: jest.fn(),
});

const mockCartRepository = () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  remove: jest.fn(),
});

describe('CartController', () => {
  let controller: CartController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        {
          provide: CartService,
          useValue: mockCartService,
        },
        {
          provide: 'StockService',
          useValue: mockStockService,
        },
        {
          provide: 'StockRepository',
          useFactory: mockStockRepository,
        },
        {
          provide: 'CartRepository',
          useFactory: mockCartRepository,
        },
      ],
    }).compile();

    controller = module.get<CartController>(CartController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addToCart', () => {
    it('should add an item to the cart', async () => {
      const dto = { productId: 1, quantity: 10 };
      const expectedResponse = { id: 1, product: { id: 1 }, quantity: 10 };

      mockCartService.addToCart.mockResolvedValue(expectedResponse);

      const result = await controller.addToCart(dto);
      expect(mockCartService.addToCart).toHaveBeenCalledWith(
        dto.productId,
        dto.quantity,
      );
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('getAllCartItems', () => {
    it('should get all cart items', async () => {
      const expectedResponse = [{ id: 1, product: { id: 1 }, quantity: 10 }];
      mockCartService.getCartItems.mockResolvedValue(expectedResponse);

      const result = await controller.getAllCartItems();
      expect(mockCartService.getCartItems).toHaveBeenCalled();
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('updateCartItem', () => {
    it('should update a cart item', async () => {
      const cartId = '1'; // Simulating route parameter
      const updateDto = { quantity: 5 };
      const expectedResponse = { id: 1, product: { id: 1 }, quantity: 5 };

      mockCartService.updateCartItem.mockResolvedValue(expectedResponse);

      const result = await controller.updateCartItem(cartId, updateDto);
      expect(mockCartService.updateCartItem).toHaveBeenCalledWith(
        parseInt(cartId),
        updateDto.quantity,
      );
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('removeFromCart', () => {
    it('should remove a cart item', async () => {
      const cartId = '1'; // Simulating route parameter
      mockCartService.removeFromCart.mockResolvedValue(cartId);

      await controller.removeFromCart(cartId);
      expect(mockCartService.removeFromCart).toHaveBeenCalledWith(
        parseInt(cartId),
      );
    });
  });
});
