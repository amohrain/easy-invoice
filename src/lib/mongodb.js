import mongoose from "mongoose";

export default async function connectDB() {
  try {
    const { connection } = await mongoose.connect(process.env.MONGODB_URI);

    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Something went wrong!");
    console.log(error);
  }
}
