import { auth } from "@clerk/nextjs/server";
import connectDB from "../../../../lib/mongodb";
import Client from "../../../../models/client.model";
import { NextResponse } from "next/server";
import { getMongoUser } from "../../../../lib/getMongoUser";

export async function GET(request) {
  try {
    const { userId } = await auth();
    console.log("Clerk ID:", userId);
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }
    const user = await getMongoUser(userId);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 }
      );
    }

    // Connect to the database
    await connectDB();

    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");
    const email = searchParams.get("email");

    if (!name || !email) {
      return NextResponse.json(
        {
          success: false,
          error: "Client not found",
        },
        { status: 404 }
      );
    }
    const results = await Client.find({
      company: user.company,
      clientName: { $regex: name, $options: "i" },
      clientEmail: { $regex: email, $options: "i" },
    });

    return NextResponse.json({
      success: true,
      data: results[0],
    });
  } catch (error) {
    console.log("Error fetching clients");
  }
}
