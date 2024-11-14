import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./user.js";

dotenv.config()

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((error) => console.log(error));

function addUser(user) {
  return User.findOne({ username: user.username })
    .then(existingUser => {
      if (existingUser) {
        throw new Error('User already exists');
      } else {
        const userToAdd = new User(user);
        return userToAdd.save();
      }
    })
    .then(result => {
      return result;
    })
    .catch(error => {
      console.error(error);
      throw error;
    });
}

function getUsers(name) {
  let promise;
  if (name === undefined) {
    promise = User.find();
  } else {
    promise = findUserByName(name);
  }
  return promise;
}

function findUserByName(name) {
  return User.find({ name: name });
}

function getUser(username, password) {
  let promise;

  if (username === undefined && password === undefined) {
    promise = User.find();
  } else {
    promise = findUserByUsernameAndPassword(username, password);
  }

  return promise;
}

function findUserByUsernameAndPassword(username, password) {
  return User.findOne({ username, password })
    .then((user) => {
      return user || null;
    });
}

function findUserById(id) {
  return User.findById(id);
}

function deleteUser(id){
  return User.findOneAndDelete({ _id: id });
}

export default {
  addUser,
  getUsers,
  getUser,
  findUserById,
  deleteUser
};
