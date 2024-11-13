const express = require("express");
const cors = require("cors");
require("dotenv").config();
const userServices = require("./testuserservices.js");

const app = express();
const port = 8700;

app.use(express.json());

app.get("/test_env", (req, res) => {
  res.send(`Process MONGODB_URI: ${process.env.MONGODB_URI}`);
});

app.get("/users", async (req, res) => {
  const name = req.query["name"];
  const job = req.query["job"];
  try {
    const result = await userServices.getUsers(name, job);
    res.send({ users_list: result });
  } catch (error) {
    console.log(error);
    res.status(500).send("An error ocurred in the server.");
  }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

app.post("/users", async (req, res) => {
  const user = req.body;
  const savedUser = await userServices.addUser(user);
  if (savedUser) res.status(201).send(savedUser);
  else res.status(500).end();
});
