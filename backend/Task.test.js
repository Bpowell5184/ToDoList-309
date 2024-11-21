import Task from './Task.js';

test('Is Jest working at all???', () => {
  const yes = true;

  expect(yes).toBeTruthy();
});

test('Does Task Schema Work?', () => {
  const result = new Task();
  expect(result).toBeTruthy();
});
