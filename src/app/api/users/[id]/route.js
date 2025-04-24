import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/user.model";

export async function GET(request, { params }) {
  const id = params.id;
  await connectDB(); // Connect to DB

  try {
    const user = await User.findById(id);
    if (!user)
      return NextResponse.json({
        error: "User not found",
        status: 404,
      });

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    return NextResponse.json({
      error: "Internal Server Error",
      status: 500,
    });
  }
}

export async function PUT(request, { params }) {
  const id = await params.id;
  await connectDB(); // Connect to DB

  try {
    const userData = await request.json();

    const user = await User.findByIdAndUpdate(
      id,
      userData,
      { new: true } // Return the updated user
    );
    if (!user)
      return NextResponse.json({
        error: "User not found",
        status: 404,
      });

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    return NextResponse.json({
      error: "Internal Server Error",
      status: 500,
    });
  }
}
