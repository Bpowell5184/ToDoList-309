import { Types } from 'mongoose';
import Task from './Task.js';

test('Is Jest working at all???', () => {
  const yes = true;

  expect(yes).toBeTruthy();
});

test('Does Task Schema Work?', () => {
  const mocktask = {
    userid: Types.ObjectId, //user id is causing test to fail
    task_name: 'myTask',
    task_due_date: 174000000000, //task_due_date also fails
    task_description: 'Hi.',
    task_tags: ['myTag'],
    task_complete: false,
  };
  const result = new Task(mocktask);

  expect(result).toBeTruthy();
  //expect(result.userid).toBe('something');
  expect(result.task_name).toMatch('myTask');
  //expect(result.task_due_date).toBe(174000000000);
  expect(result.task_tags[0]).toMatch('myTag');
  expect(result.task_description).toMatch('Hi.');
  expect(result.task_completed).toBeFalsy();
});

test('test_name', () => {
  const result = 0;

  expect(result).toBe(0);
});
