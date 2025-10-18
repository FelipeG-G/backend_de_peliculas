import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  lastname: string;
  birthdate: Date;
  email: string;
  password: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;

}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    lastname: { type: String, required: true },
    birthdate: { type: Date, required: true },
    email: { type: String, required: true, unique: true,match: [/\S+@\S+\.\S+/, "Por favor, ingrese un correo electrónico válido"]},
    password: { type: String, required: true },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }, 
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", userSchema);
export default User;
