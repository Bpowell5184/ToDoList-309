import express from "express";
import cors from "cors";
import userServices from "./userservices.js";
import mongoose from "mongoose";
import User from "./User.js";
import Task from "./Task.js";
const app = express();
const port = 8700;

app.use(express.json());
app.use(cors());

app.get("/users", async (req, res) => {
  const name = req.query.name;
  const job = req.query.job;

  try {
    const result = await userServices.getUsers(name, job);
    res.send({ users_list: result });
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred on the server.");
  }
});

app.post("/users", async (req, res) => {
  const user = req.body;
  try {
    const savedUser = await userServices.addUser(user);
    if (savedUser) res.status(201).send(savedUser);
    else res.status(500).send("User creation failed.");
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send("An error occurred while saving the user.");
  }
});

app.post("/users/:userid/tasks", async (req, res) => {
  try {
    const { userid } = req.params;
    const user = await User.findById(userid).populate("tasks");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const newTask = new Task({
      title: req.body.title,
      description: req.body.description,
      dueDate: req.body.dueDate,
      points: req.body.points,
      priority: req.body.priority,
      completionStatus: req.body.completed || false,
      userId: user._id
    });
    const savedTask = await newTask.save();
    user.tasks.push(savedTask._id);
    await user.save();
    res
      .status(201)
      .json({ message: "Task added to user", task: savedTask });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
app.get("/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate("tasks");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
// Test to make sure database connection is working:
app.get("/adduser", async (req, res) => {
  const testUser = {
    username: "testuser",
    name: "Test User",
    password: "testpassword123"
  };

  try {
    const savedUser = await userServices.addUser(testUser);
    if (savedUser) {
      res.status(201).send({
        message: "Test user added successfully",
        user: savedUser
      });
    } else {
      res.status(500).send("Failed to add test user.");
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send("An error occurred while adding the test user.");
  }
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});
