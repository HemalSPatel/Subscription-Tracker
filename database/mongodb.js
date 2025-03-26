import mongoose from "mongoose";

import { DB_URI, NODE_ENV } from "../config/env.js";

const connectToDb = async () => {
  if (!DB_URI) {
    throw new Error(
      "Please define the mongodb DB_URI env variable in .env.<developement/production>.local",
    );
  }
  try {
    await mongoose.connect(DB_URI); //this is used to connect to the database instance
    console.log("Connected to the database in mode: ", NODE_ENV);
  } catch (error) {
    console.error("Error connecting to the database: ", error);
  }
};

export default connectToDb;
