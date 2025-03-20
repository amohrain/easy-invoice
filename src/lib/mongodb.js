import mongoose from "mongoose";

async function connectDB() {
  try {
    const { connection } = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DB,
    });

    console.log("Connected to MongoDB", connection);
  } catch (error) {
    console.log("Something went wrong!");
    console.log(error);
  }
}

export default connectDB;
