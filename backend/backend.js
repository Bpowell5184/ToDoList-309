import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import taskServices from './taskservices.js';
import userServices from './userservices.js';
import User from './User.js';
import Task from './Task.js';
const app = express();
const port = process.env.PORT || 8700;

app.use(express.json());
app.use(cors());

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Not sure any of this works as it was from before updates to userservices and taskservices:
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/', async (req, res) => {
  res.status(200).send('Welcome to the Backend');
});

app.get('/users', async (req, res) => {
  const name = req.query.name;
  const job = req.query.job;

  try {
    const result = await userServices.getUsers(name, job);
    res.send({ users_list: result });
  } catch (error) {
    console.log(error);
    res.status(500).send('An error occurred on the server.');
  }
});

app.post('/users', async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(req.body.password, salt);
    let user = new User();
    user = req.body;
    user.password = hashedpassword;
    const savedUser = await userServices.addUser(user);
    if (savedUser) res.status(201).send(savedUser);
    else res.status(500).send('User creation failed.');
  } catch (error) {
    console.log(error);
    res.status(500).send('An error occurred while saving the user.');
  }
});

app.post('/users/:userid/tasks', async (req, res) => {
  try {
    const { userid } = req.params;
    const user = await User.findById(userid).populate('tasks');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const newTask = new Task({
      title: req.body.title,
      description: req.body.description,
      dueDate: req.body.dueDate,
      points: req.body.points,
      priority: req.body.priority,
      completionStatus: req.body.completed || false,
      userId: user._id,
    });
    const savedTask = await newTask.save();
    user.tasks.push(savedTask._id);
    await user.save();
    res.status(201).json({ message: 'Task added to user', task: savedTask });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
app.get('/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate('tasks');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
//User Endpoints

//add user
app.post('/adduser', async (req, res) => {
  const { username, name, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedpassword = await bcrypt.hash(password, salt);
  if (!username || !name || !hashedpassword) {
    return res.status(400).send({ message: 'Missing required fields' });
  }

  const user = { username, name, password: hashedpassword };

  try {
    const savedUser = await userServices.addUser(user);
    res.status(201).send({
      message: 'User added successfully',
      user: savedUser,
    });
  } catch (error) {
    console.error('Error adding user:', error);
    res
      .status(500)
      .send({ message: 'An error occurred while adding the user.' });
  }
});

// get user by username and password
app.post('/getuser', async (req, res) => {
  console.log("Received request body:", req.body);
  console.log("Mongoose Query:", { username: req.body.username });

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send({ message: 'Username & Password is required' });
  }

  try {
    const user = await userServices.findUserByUsername(username);
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    } else {
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).send({ message: 'Invalid password' });
      }
      res.status(200).send({ message: 'User retrieved successfully', user });
    }
  } catch (error) {
    console.error('Error retrieving user:', error);
    res
      .status(500)
      .send({ message: 'An error occurred while retrieving the user.' });
  }
});

//get user by id
app.get('/finduser/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await userServices.findUserById(userId);
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    res.status(200).send({
      message: 'User retrieved successfully',
      user,
    });
  } catch (error) {
    console.error('Error retrieving user:', error);
    res
      .status(500)
      .send({ message: 'An error occurred while retrieving the user.' });
  }
});

// delete user
app.delete('/deleteuser/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const deletedUser = await userServices.deleteUser(userId);
    if (!deletedUser) {
      return res.status(404).send({ message: 'User not found' });
    }
    res.status(200).send({
      message: 'User deleted successfully',
      user: deletedUser,
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res
      .status(500)
      .send({ message: 'An error occurred while deleting the user.' });
  }
});

/// Task endpoints
app.post('/tasks', async (req, res) => {
  const {
    userid,
    task_name,
    task_due_date,
    points,
    task_description,
    task_tags,
  } = req.body;

  if (!userid || !task_name || !task_due_date) {
    return res
      .status(400)
      .send({ message: 'userid, task_name, and task_due_date are required.' });
  }

  try {
    const newTask = {
      userid,
      task_name,
      task_due_date: new Date(task_due_date),
      points,
      task_description: task_description || '',
      task_tags: task_tags || [],
      task_completed: false,
    };

    const savedTask = await taskServices.addTask(newTask);

    res.status(201).send({
      message: 'Task added successfully.',
      task: savedTask,
    });
  } catch (error) {
    console.error('Error adding task:', error);
    res
      .status(500)
      .send({ message: 'An error occurred while adding the task.' });
  }
});

//task edit
app.put('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const updatedTask = await Task.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedTask) {
      return res.status(404).send({ message: 'Task not found' });
    }

    res.status(200).send({
      message: 'Task updated successfully',
      task: updatedTask,
    });
  } catch (error) {
    console.error('Error updating task:', error);
    res
      .status(500)
      .send({ message: 'An error occurred while updating the task' });
  }
});

//task delete
app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).send({ message: 'Task not found' });
    }

    res.status(200).send({
      message: 'Task deleted successfully',
      task: deletedTask,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: 'An error occurred while deleting the task' });
  }
});

//get tasks by userid
app.get('/tasks/:userid', async (req, res) => {
  const { userid } = req.params;

  try {
    const tasks = await taskServices.getTask(userid);
    if (tasks.length === 0) {
      return res.status(404).send({ message: 'No tasks found for this user.' });
    }
    res.status(200).send({ message: 'Tasks retrieved successfully', tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res
      .status(500)
      .send({ message: 'An error occurred while fetching tasks.' });
  }
});

// set task completed
app.put('/tasks/:taskid/complete', async (req, res) => {
  const { taskid } = req.params;

  try {
    const updatedTask = await taskServices.setTaskTrue(taskid);
    if (!updatedTask) {
      return res.status(404).send({ message: 'Task not found.' });
    }

    res.status(200).send({
      message: 'Task marked as completed successfully.',
      task: updatedTask,
    });
  } catch (error) {
    console.error('Error marking task as completed:', error);
    res
      .status(500)
      .send({ message: 'An error occurred while updating the task status.' });
  }
});
//set task incomplete
app.put('/tasks/:taskid/incomplete', async (req, res) => {
  const { taskid } = req.params;

  try {
    const updatedTask = await taskServices.setTaskFalse(taskid);
    if (!updatedTask) {
      return res.status(404).send({ message: 'Task not found.' });
    }

    res.status(200).send({
      message: 'Task marked as incomplete successfully.',
      task: updatedTask,
    });
  } catch (error) {
    console.error('Error marking task as incomplete:', error);
    res
      .status(500)
      .send({ message: 'An error occurred while updating the task status.' });
  }
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Tests for current implementation:
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Test to add a user:
app.get('/adduser', async (req, res) => {
  const testUser = {
    username: 'testuser',
    name: 'Test User',
    password: 'testpassword123',
  };

  try {
    const savedUser = await userServices.addUser(testUser);
    if (savedUser) {
      res.status(201).send({
        message: 'Test user added successfully',
        user: savedUser,
      });
    } else {
      res.status(500).send('Failed to add test user.');
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('An error occurred while adding the test user.');
  }
});

// Test endpoint to add a task
app.get('/addtask', async (req, res) => {
  const testTask = {
    userid: '64e8f0bfc1234c567890d12e',
    task_name: 'Sample Task',
    task_due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    task_description: 'This is a test task.',
    task_tags: ['test', 'sample'],
    task_completed: 'true',
  };

  try {
    const savedTask = await taskServices.addTask(testTask);
    res.status(201).send({
      message: 'Task added successfully',
      task: savedTask,
    });
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).send('An error occurred while adding the task.');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
