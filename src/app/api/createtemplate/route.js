import connectDB from "@/lib/mongodb.js";
import { NextResponse } from "next/server";
import Template from "@/models/template.model";
import User from "@/models/user.model";

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ status: 401, error: "Unauthorized" });
    }
    await connectDB();

    const user = await User.findOne({ clerkId: userId }, (err, user) => {
      if (err) {
        return NextResponse.json({ status: 500, error: err.message });
      }
      if (!user) {
        return NextResponse.json({ status: 404, error: "User not found" });
      }
    });

    const { name, structure } = await req.json();
    console.log("Creating template", { user: "user._id", name, structure });

    const newTemplate = new Template({
      user: "user._id",
      name,
      structure,
      isPublilc: false,
    });
    await newTemplate.save();
    console.log("Template created", newTemplate);
    return NextResponse.json({ status: 201, data: newTemplate });
  } catch (error) {
    return NextResponse.json({ status: 500, error: error.message });
  }
}
