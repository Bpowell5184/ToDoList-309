import mongoose from 'mongoose';
import validator from 'validator';
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (value.length < 2)
          throw new Error('Username must be greater then 1 character');
      },
    },
    name: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (value.length < 2)
          throw new Error('Name must be greater than 1 character');
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (!validator.isStrongPassword(value, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
          })
        ) {
          throw new Error(
            'Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number, and one special character'
          );
        }
      },
    },

  },
  { collection: 'users' },
);
const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;
