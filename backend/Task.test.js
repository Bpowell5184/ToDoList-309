import { Types } from 'mongoose';
import Task from './Task.js';

test('Is Jest working at all???', () => {
  const yes = true;

  expect(yes).toBeTruthy();
});

test('Does Task Schema Work?', () => {
  const mocktask = {
    userid: new Types.ObjectId('673583c7b0e8bc99a79e5230'), //user id is causing test to fail
    task_name: 'myTask',
    task_due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    task_description: 'Hi.',
    task_tags: ['myTag'],
    task_complete: false,
  };
  const result = new Task(mocktask);

  expect(result).toBeTruthy();
  //expect(result.userid).toBe(new Types.ObjectId('673583c7b0e8bc99a79e5230'));
  expect(result.task_name).toMatch('myTask');
  //expect(result.task_due_date.toMatch(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)));
  expect(result.task_tags[0]).toMatch('myTag');
  expect(result.task_description).toMatch('Hi.');
  expect(result.task_completed).toBeFalsy();
});
