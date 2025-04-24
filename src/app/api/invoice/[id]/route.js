import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import Invoice from "@/models/invoice.model";
import { NextResponse } from "next/server";
import { getMongoUser } from "@/lib/getMongoUser";

export async function GET(req, { params }) {
  try {
    // connect to db
    await connectDB();

    // get invoice id from query params
    const id = params.id;

    // find invoice by id
    const invoice = await Invoice.findById(id);

    // if invoice not found, return error
    if (!invoice) {
      return NextResponse.json(
        {
          success: false,
          error: "Invoice not found",
        },
        { status: 404 }
      );
    }
    // return invoice
    return NextResponse.json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    // authenticate user
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

    // get mongo user
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

    // connect to db
    await connectDB();

    // get invoice id from query params
    const id = params.id;

    // find invoice by id
    const invoice = await Invoice.findById(id);

    // if invoice not found, return error
    if (!invoice) {
      return NextResponse.json(
        {
          success: false,
          error: "Invoice not found",
        },
        { status: 404 }
      );
    }

    // check if user is owner of the invoice
    if (invoice.user.toString() !== user._id.toString()) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }
    // get invoice data from request body
    const data = await req.json();

    // update invoice

    const updatedInvoice = await Invoice.updateOne(
      { _id: id },
      {
        $set: {
          ...data,
        },
      }
    );

    return NextResponse.json({
      success: true,
      data: updatedInvoice,
    });
  } catch (error) {
    console.error("Error updating invoice:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    // authenticate user
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

    // get mongo user
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

    // connect to db
    await connectDB();

    // get invoice id from query params
    const id = params.id;

    // find invoice by id
    const invoice = await Invoice.findById(id);

    // if invoice not found, return error
    if (!invoice) {
      return NextResponse.json(
        {
          success: false,
          error: "Invoice not found",
        },
        { status: 404 }
      );
    }

    // check if user is owner of the invoice
    if (invoice.user.toString() !== user._id.toString()) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    // delete invoice
    await Invoice.deleteOne({ _id: id });

    return NextResponse.json({
      success: true,
      message: "Invoice deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting invoice:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
