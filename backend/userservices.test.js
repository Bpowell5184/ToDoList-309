import userservices from './userservices.js';
import User from './User.js';
import { jest } from '@jest/globals';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

test('Is Jest working at all???', () => {
  const yes = true;

  expect(yes).toBeTruthy();
});

describe('inserting without addUser()', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db('LearnByToDoing');
  });

  afterAll(async () => {
    await connection.close();
  });

  it('should insert a doc into collection', async () => {
    const users = db.collection('users');

    const mockUser = {
      username: 'UnitTestUsername',
      name: 'UnitTestName',
      password: 'UnitTestPassword',
    };
    await users.insertOne(mockUser);

    const insertedUser = await users.findOne({ username: 'UnitTestUsername' });
    expect(insertedUser).toEqual(mockUser);
  });
});

//////////////////////////
//tests using mock objects
//////////////////////////
jest.unstable_mockModule('./User', () => ({
  findOne: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  findOneAndDelete: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
}));

describe('User Service', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Reset mocks after each test
  });

  test('should add a new user successfully', async () => {
    const mockUser = {
      username: 'testuser',
      name: 'testname',
      password: 'password',
    };

    User.findOne.mockResolvedValue(null); // No existing user
    const mockSave = jest.fn().mockResolvedValue({ id: '123', ...mockUser });
    User.prototype.save = mockSave;

    const result = await userservices.addUser(mockUser);
    expect(User.findOne).toHaveBeenCalledWith({ username: 'testuser' });
    expect(mockSave).toHaveBeenCalled();
    expect(result).toEqual({ id: '123', ...mockUser });
  });

  test('should throw an error if user already exists', async () => {
    const mockUser = {
      username: 'existinguser',
      name: 'existingname',
      password: 'existingpassword',
    };

    User.findOne.mockResolvedValue(mockUser); // User already exists

    await expect(userservices.addUser(mockUser)).rejects.toThrow(
      'User already exists',
    );
    expect(User.findOne).toHaveBeenCalledWith({ username: 'existinguser' });
  });

  test('should retrieve all users', async () => {
    const mockUsers = [
      { username: 'user1', name: 'name1', password: 'pass1' },
      { username: 'user2', name: 'name2', password: 'pass2' },
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
