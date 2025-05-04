import { auth } from "@clerk/nextjs/server";
import Client from "../../../models/client.model";
import { NextResponse } from "next/server";
import { getMongoUser } from "@/lib/getMongoUser";
import connectDB from "@/lib/mongodb";

// Function to create a client
export async function POST(request) {
  try {
    const { userId } = await auth();
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

    // Get the request body
    const { clientName, clientAddress, clientEmail, clientPhone, clientTaxId } =
      await request.json();

    console.log(
      "Creating client with data",
      clientName,
      clientAddress,
      clientEmail,
      clientPhone,
      clientTaxId
    );

    // Find if the client already exists

    const existingClient = await Client.findOne({
      clientName,
      clientEmail,
    });

    if (existingClient) {
      console.log("Found existing client");
      return NextResponse.json({
        success: true,
        data: existingClient._id,
      });
    }

    console.log("Creating new client");

    // Create a new client
    const newClient = await Client.create({
      user: user._id,
      company: user.company,
      clientName,
      clientAddress,
      clientEmail,
      clientPhone,
      clientTaxId,
      status: "active",
    });

    console.log("New Client", newClient);

    return NextResponse.json({
      success: true,
      data: newClient._id,
      status: 201,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
      status: 500,
    });
  }
}

// Function to GET all the clients of a company
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

    const results = await Client.find({
      company: user.company,
    });

    return NextResponse.json({
      succes: true,
      data: results,
    });
  } catch (error) {
    console.log("Error fetching clients");
  }
}
