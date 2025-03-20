import User from "@/models/user.model";
import Invoice from "@/models/invoice.model";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb.js";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ status: 401, error: "Unauthorized" });
    }
    await connectDB();

    const { name, email, position, industry } = await req.json();
    console.log("Creating user", { name, email, position, industry });

    const newUser = new User({
      clerkId: userId,
      name,
      email,
      position,
      industry,
    });
    await newUser.save();
    console.log("User created", newUser);
    return NextResponse.json({ status: 201, data: newUser });
  } catch (error) {
    return NextResponse.json({ status: 500, error: error.message });
  }
}
