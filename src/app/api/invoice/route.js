import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb.js";
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

// function to delete invoice(s) by ids
export async function DELETE(request) {
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

    // Parse the request body and extract ids
    const data = await request.json();
    const { ids } = data;

    // Delete invoices by ids
    const result = await Invoice.deleteMany({
      _id: { $in: ids },
      user: user._id,
    });

    // Return the result
    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error deleting invoices:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// function to update multiple invoice(s) by ids
export async function PUT(request) {
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

    // Connect to the database
    await connectDB();

    // Parse the URL and extract query parameters
    const url = new URL(request.url);
    const updateFields = {};

    // Loop over query parameters to build the update object
    url.searchParams.forEach((value, key) => {
      // Convert "true"/"false" strings to booleans, if applicable
      if (value === "true") {
        updateFields[key] = true;
      } else if (value === "false") {
        updateFields[key] = false;
      } else {
        updateFields[key] = value;
      }
    });

    // Parse the request body
    const data = await request.json();
    const { ids } = data;

    // Ensure there is something to update
    if (!ids || ids.length === 0 || Object.keys(updateFields).length === 0) {
      return NextResponse.json({
        success: false,
        message: "No IDs or update fields provided.",
      });
    }

    console.log("Update fields:", updateFields);

    // Update invoices by IDs with the dynamic fields
    const result = await Invoice.updateMany(
      { _id: { $in: ids }, user: user._id },
      { $set: updateFields }
    );

    // Return the result
    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error updating invoices:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
