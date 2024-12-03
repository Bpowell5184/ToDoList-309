import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users_list',   // Reference to the 'User' collection
      required: true,
    },
    task_name: {
      type: String,
      required: true,
      trim: true,
    },
    task_due_date: {
      type: Date,
      required: true,
      trim: true,
      validate: {
        validator: function(value) {
          // Check if the due date is in the future
          return value instanceof Date;
        },
        message: props => `${props.value} is not a future date for the task due date!`
      }
    },
    task_description: {
      type: String,
      required: false, // Assuming not required, adjust as necessary
      trim: true,
    },
    task_tags: [{
      type: String,
      required: false, // Assuming not required, adjust as necessary
      trim: true,
    }],
    // task_tags: [{
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Tag', // Reference to the 'Tag' collection
    // }],
    points: {
        type: Number,
        required: false,
        default: 5
    },
    task_completed: {
      type: Boolean,
      required: true,
      default: false,
    },
    task_id: { type: String },
  },
  { collection: "tasks" } // Define the collection name
);

TaskSchema.pre('save', function (next) {
  if (!this.task_id) {
    this.task_id = this._id.toString();
  }
  next();
});
const Task = mongoose.model("Task", TaskSchema);

export default Task;
