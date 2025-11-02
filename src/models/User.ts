import mongoose, { Schema, Document } from "mongoose";

/**
 * @interface IUser
 * @description Represents the User entity schema.
 * Includes personal information, authentication details, and password reset tokens.
 */
export interface IUser extends Document {
  username: string;
  lastname: string;
  birthdate: Date;
  email: string;
  password: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}

/**
 * @schema userSchema
 * @description Defines the MongoDB schema for users.
 */
const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    lastname: { type: String, required: true },
    birthdate: { type: Date, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/\S+@\S+\.\S+/, "Please enter a valid email address"],
    },
    password: { type: String, required: true },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

/**
 * @model User
 * @description Mongoose model for the User collection.
 */
const User = mongoose.model<IUser>("User", userSchema);
export default User;
