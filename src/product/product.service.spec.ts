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

      // Configurer les mocks pour retourner des valeurs spécifiques
      repository.create.mockReturnValue(productData); // Retourne directement productData pour simuler l'opération de création
      repository.save.mockResolvedValue(productData); // Simule la sauvegarde et retourne ce qui a été "sauvegardé"

      // Appeler la méthode à tester
      const result = await service.createProduct(productData);

      // Vérifier que les méthodes mockées ont été appelées avec les bonnes valeurs
      expect(repository.create).toHaveBeenCalledWith(productData);
      expect(repository.save).toHaveBeenCalledWith(productData);

      // Vérifier que le résultat est ce qui est attendu
      expect(result).toEqual(productData);
    });
  });

  // Vous pouvez ajouter d'autres tests ici pour findAllProducts, findProductById, updateProduct, et deleteProduct
  describe('findAllProducts', () => {
    it('should return all products', async () => {
      const products = [
        { name: 'Test Product 1', price: 100 },
        { name: 'Test Product 2', price: 200 },
      ];

      repository.find.mockResolvedValue(products);

      const result = await service.findAllProducts();

      expect(result).toEqual(products);
    });
  });

  describe('findProductById', () => {
    it('should return a product by ID', async () => {
      const product = { id: 1, name: 'Test Product', price: 100 };

      repository.findOneBy.mockResolvedValue(product);

      const result = await service.findProductById(1);

      expect(result).toEqual(product);
    });
  });

  describe('updateProduct', () => {
    it('should update a product', async () => {
      const product = { id: 1, name: 'Test Product', price: 100 };
      const updatedProductData = { name: 'Updated Product', price: 200 };

      repository.findOneBy.mockResolvedValue(product);
      repository.save.mockResolvedValue(updatedProductData);

      const result = await service.updateProduct(1, updatedProductData);

      expect(result).toEqual(updatedProductData);
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      const product = { id: 1, name: 'Test Product', price: 100 };

      repository.delete.mockResolvedValue({ affected: 1 });
      repository.findOneBy.mockResolvedValue(product);

      await service.deleteProduct(1);

      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  });
});
