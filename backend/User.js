import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (value.length < 2)
          throw new Error("Username must be greater then 1 character");
      },
    },
    name: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (value.length < 2)
          throw new Error("Name must be greater than 1 character");
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (value.length < 2)
          throw new Error("Password must be at least 2 characters");
      },
    },
    tasks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Task' }]
  },
  { collection: "users" }
);
const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;
