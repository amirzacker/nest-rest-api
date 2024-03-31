import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { Product } from './product.entity';

describe('ProductService', () => {
  let service: ProductService;
  let repository;

  const mockProductRepository = () => ({
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    delete: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useFactory: mockProductRepository,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('createProduct', () => {
    it('should successfully insert a product', async () => {
      const productData = { name: 'Test Product', price: 100 };
      repository.save.mockResolvedValue(productData);

      expect(repository.create).not.toHaveBeenCalled();
      expect(repository.save).not.toHaveBeenCalled();

      const result = await service.createProduct(productData);

      expect(repository.create).toHaveBeenCalledWith(productData);
      expect(repository.save).toHaveBeenCalledWith(productData);
      expect(result).toEqual(productData);
    });
  });

  // Vous pouvez ajouter d'autres tests ici pour findAllProducts, findProductById, updateProduct, et deleteProduct
});
