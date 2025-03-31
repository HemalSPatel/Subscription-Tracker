import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";
import User from "../models/user.model.js";

export const signUp = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    //Extracting the data from the request body
    const { name, email, password } = req.body;

    // Checking if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("User already exists.");
      error.statusCode = 409;
      throw error;
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Creating a new user
    const newUsers = await User.create(
      [
        {
          name,
          email,
          password: hashedPassword,
        },
      ],
      { session },
    );

    const token = jwt.sign({ userId: newUsers[0]._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    await session.commitTransaction();
    res.status(201).json({
      success: true,
      message: "User created successfully.",
      data: {
        token,
        user: newUsers[0],
      },
    });
  } catch (error) {
    // Making the transaction atomic by aborting in the case of an error
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // use the email and the password to see if the user entered the correct creadentials
    const user = await User.findOne({ email });
    // if the user does not exist we throw a not found error
    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }
    // user exists so now we check to see if they entered the correct password
    // bcrypt is hashing the inputted password to see if it matches the already hashed password that is stored in the DB
    const isPassowordCorrect = await bcrypt.compare(password, user.password);

    if (!isPassowordCorrect) {
      const error = new Error("Invalid Password.");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.status(200).json({
      success: true,
      message: "User has signed in successfully.",
      data: {
        token,
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

// export const signOut = async (req, res, next) => {};
