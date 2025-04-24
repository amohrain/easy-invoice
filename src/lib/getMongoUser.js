import User from "@/models/user.model";
import connectDB from "./mongodb.js";

export const getMongoUser = async (clerkId) => {
  try {
    // Connect to the database
    await connectDB();

    // Find the user in the database
    const user = await User.findOne({ clerkId });

    // If user is not found, return null
    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};
