import User from "../../../../models/user.model";
import { auth } from "@clerk/nextjs/server";
import connectDB from "../../../../lib/mongodb";
import { NextResponse } from "next/server";
import Template from "../../../../models/template.model";

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ status: 401, error: "Unauthorized" });
    }
    await connectDB();
    const { name, email, position, industry } = await req.json();
    console.log("Creating user", { name, email, position, industry });

    // Get public templates for the user
    const publicTemplates = await Template.find({
      isPublic: true,
    });

    const newUser = new User({
      clerkId: userId,
      name,
      email,
      position,
      industry,
      template: publicTemplates,
      defaultTemplate: publicTemplates[0]?._id,
    });
    await newUser.save();
    console.log("User created", newUser);
    return NextResponse.json({ status: 201, data: newUser });
  } catch (error) {
    return NextResponse.json({ status: 500, error: error.message });
  }
}
