const mongoose = require("mongoose");
const TaskSchema = new mongoose.Schema({
    title: String,
    description: String,
    creationDate: Date,
    dueDate: Date,
    points: {type: Number, min:0, max:10},
    priority: {type: Number, min:0, max:10},
    tagsList: [],
    completionStatus: Boolean,
    taskId: Number
})
module.exports = TaskSchema;