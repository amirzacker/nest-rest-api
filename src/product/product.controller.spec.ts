import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

const mockProductService = {
  createProduct: jest.fn(),
  findAllProducts: jest.fn(),
  findProductById: jest.fn(),
  updateProduct: jest.fn(),
  deleteProduct: jest.fn(),
};

describe('ProductController', () => {
  let controller: ProductController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: mockProductService,
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Vous pouvez ajouter plus de tests ici pour vérifier les comportements des méthodes du contrôleur
  describe('createProduct', () => {
    it('should call createProduct from the ProductService', async () => {
      const productData = { name: 'Test Product', price: 100 };

      await controller.create(productData);

      expect(mockProductService.createProduct).toHaveBeenCalledWith(
        productData,
      );
    });
  });

  describe('findAllProducts', () => {
    it('should call findAllProducts from the ProductService', async () => {
      await controller.findAll();

      expect(mockProductService.findAllProducts).toHaveBeenCalled();
    });
  });

  describe('findProductById', () => {
    it('should call findProductById from the ProductService', async () => {
      const productId = '1';

      await controller.findById(productId);

      expect(mockProductService.findProductById).toHaveBeenCalledWith(
        Number(productId),
      );
    });
  });

  describe('updateProduct', () => {
    it('should call updateProduct from the ProductService', async () => {
      const productId = '1';
      const productData = { name: 'Test Product', price: 100 };

      await controller.update(productId, productData);

      expect(mockProductService.updateProduct).toHaveBeenCalledWith(
        Number(productId),
        productData,
      );
    });
  });

  describe('deleteProduct', () => {
    it('should call deleteProduct from the ProductService', async () => {
      const productId = '1';

      await controller.delete(productId);

      expect(mockProductService.deleteProduct).toHaveBeenCalledWith(
        Number(productId),
      );
    });
  });
});
