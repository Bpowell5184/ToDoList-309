import mongoose from 'mongoose';
import TaskSchema from './Task.js';
import dotenv from 'dotenv';
dotenv.config();

let dbConnection;

function getDbConnection() {
  if (!dbConnection) {
    dbConnection = mongoose.createConnection(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
  return dbConnection;
}

async function getTasks(title, taskId) {
  const taskModel = getDbConnection().model('Task', TaskSchema);
  let result;
  if (title === undefined && taskId === undefined) {
    result = await taskModel.find();
  } else if (title && taskId === undefined) {
    result = await findTaskByTitle(title);
  } else if (taskId && title === undefined) {
    result = await findTaskById(taskId);
  } else {
    result = await findTaskByTitleAndId(title, taskId);
  }
  return result;
}

async function findTaskById(taskId) {
  const taskModel = getDbConnection().model('Task', TaskSchema);
  try {
    return await taskModel.findById(taskId);
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

async function addTask(task) {
  // taskModel is a Model, a subclass of mongoose.Model
  const taskModel = getDbConnection().model('Task', TaskSchema);
  try {
    const taskToAdd = new taskModel(task);
    const savedTask = await taskToAdd.save();
    return savedTask;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function findTaskByTitle(title) {
  const taskModel = getDbConnection().model('Task', TaskSchema);
  return await taskModel.find({ title: title });
}

module.exports = {
  getTasks,
  findTaskByTitle,
  findTaskById,
  addTask,
};
