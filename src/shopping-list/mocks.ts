// mocks.ts
export const mockShoppingListRepository = () => ({
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  delete: jest.fn(),
});

export const mockProductRepository = () => ({
  findOneBy: jest.fn(),
});
