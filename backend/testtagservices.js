const mongoose = require("mongoose");
const TagSchema = require("./testtag.js");
const dotenv = require("dotenv");
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

async function getTags(tag, tagId) {
  const tagModel = getDbConnection().model("Tag", TagSchema);
  let result;
  if (tag === undefined && tagId === undefined) {
    result = await tagModel.find();
  } else if (tag && tagId === undefined) {
    result = await findTagByTag(tag);
  } else if (tagId && tag === undefined) {
    result = await findTagByTagId(tagId);
  } else {
    result = await findTagByTagAndTagId(tag, tagId);
  }
  return result;
}

async function findTagByTagId(tagId) {
  const tagModel = getDbConnection().model("Tag", TagSchema);     
  try {
    return await tagModel.findById(tagId);
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

async function addTag(tag) {
  // tagModel is a Model, a subclass of mongoose.Model
  const tagModel = getDbConnection().model("Tag", TagSchema);
  try {
    const tagToAdd = new tagModel(tag);
    const savedTag = await tagToAdd.save();
    return savedTag;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function findTagByTag(tag) {
  const tagModel = getDbConnection().model("Tag", TagSchema);       
  return await tagModel.find({ tag: tag });
}

module.exports = {
  getTags,
  findTagByTag,
  findTagByTagId,
  addTag
}
