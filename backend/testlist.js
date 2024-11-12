const mongoose = require("mongoose");
const ListSchema = new mongoose.Schema({
    LID: Number,
    UID: Number,
    taskList: []
})

module.exports = ListSchema;