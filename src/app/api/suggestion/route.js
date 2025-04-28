import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";
import Suggestion from "../../../models/clientSuggestions.model";
import Invoice from "../../../models/invoice.model";
import { auth } from "@clerk/nextjs/server";
import { getMongoUser } from "../../../lib/getMongoUser";

export async function POST(request) {
  try {
    // Connect to database
    await connectDB();

    // Extract data from request body
    const {
      invoiceId,
      clientName,
      clientAddress,
      clientEmail,
      clientPhone,
      clientTaxId,
    } = await request.json();

    // Check if there is already a suggestion
    const existingSuggestion = await Suggestion.findOne({
      invoice: invoiceId,
    });

    // make changes to the invoice
    const invoice = await Invoice.findByIdAndUpdate(
      invoiceId,
      {
        changesSuggested: true,
      },
      { new: true }
    );

    if (existingSuggestion) {
      // Update the existing suggestion
      existingSuggestion.clientName = clientName;
      existingSuggestion.clientAddress = clientAddress;
      existingSuggestion.clientEmail = clientEmail;
      existingSuggestion.clientPhone = clientPhone;
      existingSuggestion.clientTaxId = clientTaxId;
      existingSuggestion.user = invoice.user;

      await existingSuggestion.save();

      return NextResponse.json({
        success: true,
        data: existingSuggestion,
      });
    }

    // Create the suggestion
    const newSuggestion = await Suggestion.create({
      invoice: invoiceId,
      clientName,
      clientAddress,
      clientEmail,
      clientPhone,
      clientTaxId,
      user: invoice.user,
    });

    // Todo create a notification

    return NextResponse.json({
      success: true,
      data: newSuggestion,
    });
  } catch (error) {
    console.error("Error saving suggestion", error);
    return NextResponse.json({
      success: false,
      error,
    });
  }
}

export async function GET(request) {
  try {
    const { userId } = await auth();

    // Check if userId is provided
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

    // Check if user is found
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 }
      );
    }

    // Get invoice id from params
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const suggestion = await Suggestion.findOne({
      invoice: id,
    });

    if (!suggestion) {
      return NextResponse.json({
        success: true,
        message: "No suggestion found",
      });
    }

    // Todo- Add check if authorized

    return NextResponse.json({
      success: true,
      data: suggestion,
    });
  } catch (error) {
    console.error("Error fetching suggestion", error);
    return NextResponse.json({
      success: false,
      error,
    });
  }
}

export async function DELETE(request) {
  try {
    await connectDB();
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

    // get company id from query params
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Suggestion ID is required",
        },
        { status: 400 }
      );
    }

    // Delete the company
    await Suggestion.deleteOne({ _id: id });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Error deleting suggestion:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
