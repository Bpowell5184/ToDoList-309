import mongoose from "mongoose";
import taskModel from "./Task.js";
import dotenv from "dotenv"

mongoose.set("debug", true);
dotenv.config()
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((error) => console.log(error));

function getTask(id) {
    let promise;
    if (id === undefined) {
      promise = taskModel.find();
    } else {
      promise = findTaskByUserId(id);
    }
    return promise;
}

function setTaskTrue(taskId) {
  let promise;
  if (!taskId) {
    promise = Promise.reject(new Error('Task ID is required'));
  } else {
    promise = taskModel.findById(taskId)
      .then(task => {
        if (!task) {
          throw new Error('Task not found');
        }
        task.task_completed = true;
        return task.save();
      });
  }
  return promise;
}

function setTaskFalse(taskId) {
  let promise;
  if (!taskId) {
    promise = Promise.reject(new Error('Task ID is required'));
  } else {
    promise = taskModel.findById(taskId)
      .then(task => {
        if (!task) {
          throw new Error('Task not found');
        }
        task.task_completed = false;
        return task.save();
      });
  }
  return promise;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Will want to do by month instead of week most likely
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getWeekTasksTrue(userId, currentDate){
    currentDate = new Date(currentDate);
    
    if (currentDate !== undefined && !(currentDate instanceof Date) || isNaN(currentDate)) {
      throw new Error("Invalid currentDate. Please provide a valid Date object.");
    }

    let promise;
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getUTCDay() - 1);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 9);

    const pipeline = [
        {
            $match: {
                userid: new mongoose.Types.ObjectId(userId),
                task_completed: true,
                task_due_date: {
                    $gte: startOfWeek,
                    $lt: endOfWeek
                }
            }
        },
        {
          $group: {
              _id: { $dayOfWeek: { date: "$task_due_date", timezone: "UTC" } },
              tasks: { $push: "$$ROOT" } // push documents into an array for each day
          }
      },
    ];

    promise = taskModel.aggregate(pipeline);
    return promise
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Will want to do by month instead of week most likely
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getWeekTasksFalse(userId, currentDate){
  currentDate = new Date(currentDate);
  
  if (currentDate !== undefined && !(currentDate instanceof Date) || isNaN(currentDate)) {
    throw new Error("Invalid currentDate. Please provide a valid Date object.");
  }

  let promise;
  const startOfWeek = new Date(currentDate);

  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getUTCDay() - 1);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 9);

  console.log("Start of the week:", startOfWeek.toISOString());
  console.log("End of the week:", endOfWeek.toISOString());

  const pipeline = [
      {
          $match: {
              userid: new mongoose.Types.ObjectId(userId),
              task_completed: false,
              task_due_date: {
                  $gte: startOfWeek,
                  $lt: endOfWeek
              }
          }
      },
      {
        $group: {
            _id: { $dayOfWeek: { date: "$task_due_date", timezone: "UTC" } },
            tasks: { $push: "$$ROOT" }
        }
    },
  ];

  promise = taskModel.aggregate(pipeline);

  promise.then(result => {
    console.log("Promise result:");
    result.forEach(item => {
        console.log(JSON.stringify(item, null, 2));
    });
    }).catch(error => {
        console.error("Promise error:", error);
    });
  
  return promise;
}

function findTaskByUserId(id) {
    return taskModel.find({ userid: id });
  }

function addTask(task) {
    const taskToAdd = new taskModel(task);
    const promise = taskToAdd.save();
    return promise;
}

export default {
    addTask,
    getWeekTasksTrue,
    getWeekTasksFalse,
    getTask,
    findTaskByUserId,
    setTaskFalse,
    setTaskTrue,
  };