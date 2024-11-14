import mongoose from "mongoose";
const TaskSchema = new mongoose.Schema({
    title: String,
    description: String,
    creationDate: {type: Date, default: Date.now},
    dueDate: Date,
    points: {type: Number, min:0, max:10},
    priority: {type: Number, min:0, max:10},
    tagsList: [],
    completionStatus: Boolean,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'} 
})
export default mongoose.model('Task', TaskSchema);
