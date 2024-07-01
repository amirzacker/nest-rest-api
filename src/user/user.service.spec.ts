import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './user.entity';

describe('UserService', () => {
  let service: UserService;
  let repository;

  const mockUserRepository = () => ({
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    delete: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useFactory: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('createUser', () => {
    it('should successfully insert a user', async () => {
      const userData = { email: 'Test User', password: '100' };

      // Configurer les mocks pour retourner des valeurs spécifiques
      repository.create.mockReturnValue(userData); // Retourne directement userData pour simuler l'opération de création
      repository.save.mockResolvedValue(userData); // Simule la sauvegarde et retourne ce qui a été "sauvegardé"

      // Appeler la méthode à tester
      const result = await service.createUser(userData);

      // Vérifier que les méthodes mockées ont été appelées avec les bonnes valeurs
      expect(repository.create).toHaveBeenCalledWith(userData);
      expect(repository.save).toHaveBeenCalledWith(userData);

      // Vérifier que le résultat est ce qui est attendu
      expect(result).toEqual(userData);
    });
  });

  // Vous pouvez ajouter d'autres tests ici pour findAllUsers, findUserById, updateUser, et deleteUser
  describe('findAllUsers', () => {
    it('should return all users', async () => {
      const users = [
        { email: 'Test User 1', password: '100' },
        { email: 'Test User 2', password: '200' },
      ];

      repository.find.mockResolvedValue(users);

      const result = await service.findAllUsers();

      expect(result).toEqual(users);
    });
  });

  describe('findUserById', () => {
    it('should return a user by ID', async () => {
      const user = { id: 1, email: 'Test User', password: '100' };

      repository.findOneBy.mockResolvedValue(user);

      const result = await service.findUserById(1);

      expect(result).toEqual(user);
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const user = { id: 1, email: 'Test User', password: '100' };
      const updatedUserData = { email: 'Updated User', password: '200' };

      repository.findOneBy.mockResolvedValue(user);
      repository.save.mockResolvedValue(updatedUserData);

      const result = await service.updateUser(1, updatedUserData);

      expect(result).toEqual(updatedUserData);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const user = { id: 1, email: 'Test User', password: '100' };

      repository.delete.mockResolvedValue({ affected: 1 });
      repository.findOneBy.mockResolvedValue(user);

      await service.deleteUser(1);

      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  });
});
