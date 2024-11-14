import express from "express";
import cors from "cors";
import userServices from "./userservices.js";

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
    res.status(500).send("An error occurred while saving the user.");
  }
});

// Test to make sure database connection is working:
app.get("/adduser", async (req, res) => {
  const testUser = {
    username: "testuser",
    name: "Test User",
    password: "testpassword123",
  };

  try {
    const savedUser = await userServices.addUser(testUser);
    if (savedUser) {
      res.status(201).send({
        message: "Test user added successfully",
        user: savedUser,
      });
    } else {
      res.status(500).send("Failed to add test user.");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while adding the test user.");
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
