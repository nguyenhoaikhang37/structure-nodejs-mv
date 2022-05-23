import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { testConnection } from "../helpers/connections-multi-mongodb.js";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    lowercase: true,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(this.password, salt);
    this.password = hashPassword;
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.isCheckPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = testConnection.model("user", userSchema);
export default User;
