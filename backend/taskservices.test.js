import taskservices from './taskservices.js';
import Task from './Task.js';

test('Is Jest working at all???', () => {
  const yes = true;

  expect(yes).toBeTruthy();
});

import taskService from './taskservices';
import taskModel from './Task';

jest.mock('./Task', () => ({
  // Mock the Task model
  find: jest.fn(),
  findById: jest.fn(),
  aggregate: jest.fn(),
  save: jest.fn(),
}));

describe('Task Services', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Reset mocks after each test
  });

  describe('getTask', () => {
    test('should return all tasks when id is undefined', async () => {
      const mockTasks = [
        { _id: '1', name: 'Task 1' },
        { _id: '2', name: 'Task 2' },
      ];
      taskModel.find.mockResolvedValue(mockTasks);

      const result = await taskService.getTask(undefined);
      expect(taskModel.find).toHaveBeenCalled();
      expect(result).toEqual(mockTasks);
    });

    test('should return tasks by user ID when id is provided', async () => {
      const userId = '123';
      const mockTasks = [{ _id: '1', name: 'Task 1', userid: userId }];
      taskModel.find.mockResolvedValue(mockTasks);

      const result = await taskService.getTask(userId);
      expect(taskModel.find).toHaveBeenCalledWith({ userid: userId });
      expect(result).toEqual(mockTasks);
    });
  });

  describe('setTaskTrue', () => {
    test('should mark a task as completed', async () => {
      const mockTask = { _id: '1', task_completed: false, save: jest.fn() };
      taskModel.findById.mockResolvedValue(mockTask);
      mockTask.save.mockResolvedValue({ ...mockTask, task_completed: true });

      const result = await taskService.setTaskTrue('1');
      expect(taskModel.findById).toHaveBeenCalledWith('1');
      expect(mockTask.save).toHaveBeenCalled();
      expect(result.task_completed).toBe(true);
    });

    test('should throw an error if task is not found', async () => {
      taskModel.findById.mockResolvedValue(null);

      await expect(taskService.setTaskTrue('999')).rejects.toThrow(
        'Task not found',
      );
      expect(taskModel.findById).toHaveBeenCalledWith('999');
    });
  });

  describe('getWeekTasksTrue', () => {
    test('should retrieve completed tasks for the current week', async () => {
      const userId = '123';
      const currentDate = '2023-12-10';
      const mockPipelineResult = [{ _id: 1, tasks: [{ task: 'Sample Task' }] }];

      taskModel.aggregate.mockResolvedValue(mockPipelineResult);

      const result = await taskService.getWeekTasksTrue(userId, currentDate);
      expect(taskModel.aggregate).toHaveBeenCalled();
      expect(result).toEqual(mockPipelineResult);
    });

    test('should throw an error for invalid date', () => {
      expect(() => taskService.getWeekTasksTrue('123', 'invalid-date')).toThrow(
        'Invalid currentDate. Please provide a valid Date object.',
      );
    });
  });

  describe('addTask', () => {
    test('should add a new task', async () => {
      const newTask = { name: 'New Task', task_completed: false };
      const mockTask = { ...newTask, _id: '123' };

      const mockSave = jest.fn().mockResolvedValue(mockTask);
      taskModel.prototype.save = mockSave;

      const result = await taskService.addTask(newTask);
      expect(mockSave).toHaveBeenCalled();
      expect(result).toEqual(mockTask);
    });
  });
});
