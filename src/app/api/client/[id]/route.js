import { auth } from "@clerk/nextjs/server";
import connectDB from "../../../../lib/mongodb";
import { NextResponse } from "next/server";
import Client from "../../../../models/client.model";
import { getMongoUser } from "../../../../lib/getMongoUser";

export async function GET(request, { params }) {
  try {
    // Authenticate user
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: "Unauthorized",
      });
    }
    // Connect to database
    await connectDB();

    // Find client by ID
    const { id } = params;
    const clientInfo = await Client.findById(id);

    if (!clientInfo) {
      return NextResponse.json({
        success: false,
        error: "client not found",
      });
    }
    console.log(clientInfo);

    return NextResponse.json({
      sucess: true,
      data: clientInfo,
    });
  } catch (error) {
    console.log("Error fetching client: ", error);
  }
}

// Function to update a client
export async function PUT(request, { params }) {
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

    const { id } = params;

    // Get the request body
    const clientData = await request.json();

    // Find the client by ID
    const existingClient = await Client.findByIdAndUpdate(id, clientData, {
      new: true,
    });

    if (!existingClient) {
      return NextResponse.json(
        {
          success: false,
          error: "Client not found",
        },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      data: existingClient,
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
      status: 500,
    });
  }
}

// Function to delete a client
export async function DELETE(request, { params }) {
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

    // Get the id from params

    const { id } = params;

    // Find the client by ID and delete
    const existingClient = await Client.findByIdAndDelete(id);
    if (!existingClient) {
      return NextResponse.json(
        {
          success: false,
          error: "Client not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
      status: 500,
    });
  }
}
