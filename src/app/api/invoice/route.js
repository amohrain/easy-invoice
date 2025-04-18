import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";
import Invoice from "../../../models/invoice.model";
import { auth } from "@clerk/nextjs/server";
import { getMongoUser } from "../../../lib/getMongoUser";

// function to create an invoice
export async function POST(request) {
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
  console.log("Mongo user:", user);

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        error: "User not found",
      },
      { status: 404 }
    );
  }

  try {
    // Connect to the database
    await connectDB();

    // Parse the request body
    const invoiceData = await request.json();

    // Create a new invoice
    const invoice = new Invoice({ ...invoiceData, user: user._id });
    await invoice.save();

    // Return the created invoice
    return NextResponse.json(
      {
        success: true,
        data: invoice,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating invoice:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// function to get all the invoices
export async function GET(request) {
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
  console.log("Mongo user:", user);

  try {
    // Connect to the database
    await connectDB();

    // Get all invoices
    const invoices = await Invoice.find({ user: user._id });

    // Return the invoices
    return NextResponse.json({
      success: true,
      data: invoices,
    });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
