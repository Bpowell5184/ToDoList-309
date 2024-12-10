import userservices from './userservices.js';
import User from './User.js';
import { jest } from '@jest/globals';

test('Is Jest working at all???', () => {
  const yes = true;

  expect(yes).toBeTruthy();
});

describe('User Service', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Reset mocks after each test
  });

  test('should add a new user successfully', async () => {
    const mockUser = { username: 'testuser', password: 'password' };

    User.findOne.mockResolvedValue(null); // No existing user
    const mockSave = jest.fn().mockResolvedValue({ id: '123', ...mockUser });
    User.prototype.save = mockSave;

    const result = await userservices.addUser(mockUser);
    expect(User.findOne).toHaveBeenCalledWith({ username: 'testuser' });
    expect(mockSave).toHaveBeenCalled();
    expect(result).toEqual({ id: '123', ...mockUser });
  });

  test('should throw an error if user already exists', async () => {
    const mockUser = { username: 'existinguser', password: 'password' };

    User.findOne.mockResolvedValue(mockUser); // User already exists

    await expect(userservices.addUser(mockUser)).rejects.toThrow(
      'User already exists',
    );
    expect(User.findOne).toHaveBeenCalledWith({ username: 'existinguser' });
  });

  test('should retrieve all users', async () => {
    const mockUsers = [
      { username: 'user1', password: 'pass1' },
      { username: 'user2', password: 'pass2' },
    ];

    User.find.mockResolvedValue(mockUsers);

    const result = await userservices.getUsers();
    expect(User.find).toHaveBeenCalled();
    expect(result).toEqual(mockUsers);
  });

  test('should delete a user by ID', async () => {
    const mockId = '123';
    User.findOneAndDelete.mockResolvedValue({ _id: mockId });

    const result = await userservices.deleteUser(mockId);
    expect(User.findOneAndDelete).toHaveBeenCalledWith({ _id: mockId });
    expect(result).toEqual({ _id: mockId });
  });
});
