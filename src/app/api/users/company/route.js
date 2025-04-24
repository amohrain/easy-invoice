import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/user.model";
import { getMongoUser } from "@/lib/getMongoUser";
import { NextResponse } from "next/server";

export async function PUT(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({
        error: "Unauthorized",
        status: 401,
      });
    }

    const user = await getMongoUser(userId);
    if (!user) {
      return NextResponse.json({
        error: "User not found",
        status: 404,
      });
    }

    const userData = await request.json();

    // Save company data to the user
    user.company = userData.company;
    await user.save();

    // Update the company in the database
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
