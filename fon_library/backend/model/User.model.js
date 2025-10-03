import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Enter user's name"],
    },
    email: {
      type: String,
      required: [true, "Enter user's email"],
      unique: [true, "User's email must be unique"],
    },
    password: {
      type: String,
      required: [true, "Enter user's password"],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', UserSchema);
export default User;
