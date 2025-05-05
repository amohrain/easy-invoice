import { NextResponse } from "next/server";
import Suggestion from "../../../../models/clientSuggestions.model";
import connectDB from "@/lib/mongodb";
import { auth } from "@clerk/nextjs/server";
import { getMongoUser } from "@/lib/getMongoUser";

export async function GET(request, { params }) {
  try {
    // Get invoice id from params

    const { id } = params;

    const suggestion = await Suggestion.findOne({
      invoice: id,
    });

    if (!suggestion) {
      return NextResponse.json({
        success: true,
        message: "No suggestion found",
      });
    }

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

export async function DELETE(request, { params }) {
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
    const { id } = params;

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

export async function PUT(request, { params }) {
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
    const { id } = params;
    const { clientName, clientAddress, clientEmail, clientPhone, clientTaxId } =
      request.json();

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Suggestion ID is required",
        },
        { status: 400 }
      );
    }

    // Fetch the suggestion
    const suggestion = await Suggestion.updateOne(
      { _id: id },
      {
        $set: {
          clientName,
          clientAddress,
          clientEmail,
          clientPhone,
          clientTaxId,
        },
      }
    );

    return NextResponse.json({
      success: true,
      data: suggestion,
    });
  } catch (error) {
    console.error("Error Editing suggestion:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
