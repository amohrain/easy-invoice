// import mongoose from "mongoose";

// export default async function connectDB() {
//   try {
//     const { connection } = await mongoose.connect(process.env.MONGODB_URI);

//     console.log("Connected to MongoDB");
//   } catch (error) {
//     console.log("Something went wrong!");
//     console.log(error);
//   }
// }

import mongoose from "mongoose";

let cached = global.mongoose || { conn: null, promise: null };

export default async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGODB_URI, {
        bufferCommands: false,
      })
      .then((mongoose) => {
        return mongoose;
      });
  }

  cached.conn = await cached.promise;
  global.mongoose = cached;
  return cached.conn;
}
