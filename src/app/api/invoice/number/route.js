import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb.js";
import { getMongoUser } from "@/lib/getMongoUser";
import Invoice from "@/models/invoice.model";

// Function to generate a serial invoice number
export async function GET(request) {
  try {
    // Connect to the database
    await connectDB();

    // Get the user from the request
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
    // Check if the user exists
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 }
      );
    }

    // Get the last invoice number from the database
    const lastInvoice = await Invoice.findOne({
      company: user.company,
      invoiceId: { $exists: true },
    }).sort({ invoiceId: -1 });

    // Generate the next invoice number
    const nextInvoiceId = lastInvoice ? lastInvoice.invoiceId + 1 : 1001;

    // Return the next invoice number
    return NextResponse.json({
      success: true,
      data: nextInvoiceId,
    });
  } catch (error) {
    console.error("Error generating invoice number:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
