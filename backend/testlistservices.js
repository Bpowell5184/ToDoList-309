const mongoose = require("mongoose");
const ListSchema = require("./testlist.js");
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

async function getList(LID, UID) {
  const listModel = getDbConnection().model("List", ListSchema);
  let result;
  if (LID === undefined && UID === undefined) {
    result = await listModel.find();
  } else if (LID && UID === undefined) {
    result = await findListByLID(LID);
  } else if (UID && LID === undefined) {
    result = await findListByUID(UID);
  } else {
    result = await findListByLIDAndUID(LID, UID);
  }
  return result;
}

async function addList(list) {
  // listModel is a Model, a subclass of mongoose.Model
  const listModel = getDbConnection().model("List", ListSchema);
  try {
    const listToAdd = new listModel(list);
    const savedList = await listToAdd.save();
    return savedList;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function findListByUID(UID) {
  const listModel = getDbConnection().model("List", ListSchema);       
  return await listModel.find({ UID: UID });
}

async function findListByLID(LID) {
  const listModel = getDbConnection().model("List", ListSchema);       
  return await listModel.find({ LID: LID });
}

module.exports = {
  getList,
  findListByLID,
  findListByUID,
  addList
}
