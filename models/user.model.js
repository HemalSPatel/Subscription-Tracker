import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "User name is required."],
      trim: true,
      minLength: 3,
      maxLength: 20,
    },
    email: {
      type: String,
      require: [true, "User email is required."],
      trim: true,
      unique: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Valid email address is required."], //template string for email
    },
    password: {
      type: String,
      require: [true, "User password is required."],
      minLength: 6,
    },
    role: {
      type: String,
      enum: ["User", "Admin"],
      default: "User",
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
