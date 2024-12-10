import { Types } from 'mongoose';
import User from './User.js';

test('Is Jest working at all???', () => {
  const yes = true;

  expect(yes).toBeTruthy();
});

test('Does User Schema Work?', () => {
  const mockUser = {
    username: 'RandomUser123',
    name: 'John Johnson',
    password: 'GoodGooglyMoogly!',
  };
  const result = new User(mockUser);

  expect(result).toBeTruthy();

  expect(result.username).toMatch('RandomUser123');
  expect(result.name).toMatch('John Johnson');
  expect(result.password).toMatch('GoodGooglyMoogly!');
});

test('Does User Schema validation Work?', () => {
  const mockUser = {
    username: 'a',
    name: 'b',
    password: 'c',
  };
  const result = new User(mockUser);

  expect(result).toBeTruthy();

  expect(result.username).not.toMatch('c');
  expect(result.name).not.toMatch('a');
  expect(result.password).not.toMatch('b');
});
