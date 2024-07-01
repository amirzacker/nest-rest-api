import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

const mockUserService = {
  createUser: jest.fn(),
  findAllUsers: jest.fn(),
  findUserById: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
};

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Vous pouvez ajouter plus de tests ici pour vérifier les comportements des méthodes du contrôleur
  describe('createUser', () => {
    it('should call createUser from the UserService', async () => {
      const UserData = { email: 'Test User', password: '100' };

      await controller.create(UserData);

      expect(mockUserService.createUser).toHaveBeenCalledWith(UserData);
    });
  });

  describe('findAllUsers', () => {
    it('should call findAllUsers from the UserService', async () => {
      await controller.findAll();

      expect(mockUserService.findAllUsers).toHaveBeenCalled();
    });
  });

  describe('findUserById', () => {
    it('should call findUserById from the UserService', async () => {
      const UserId = '1';

      await controller.findById(UserId);

      expect(mockUserService.findUserById).toHaveBeenCalledWith(Number(UserId));
    });
  });

  describe('updateUser', () => {
    it('should call updateUser from the UserService', async () => {
      const UserId = '1';
      const UserData = { email: 'Test User', password: '100' };

      await controller.update(UserId, UserData);

      expect(mockUserService.updateUser).toHaveBeenCalledWith(
        Number(UserId),
        UserData,
      );
    });
  });

  describe('deleteUser', () => {
    it('should call deleteUser from the UserService', async () => {
      const UserId = '1';

      await controller.delete(UserId);

      expect(mockUserService.deleteUser).toHaveBeenCalledWith(Number(UserId));
    });
  });
});
