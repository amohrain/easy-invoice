import Template from "@/models/template.model";
import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const id = params.id;
  try {
    await connectDB();

    // Get the template by ID
    const template = await Template.findById(id);

    // If template is not found, return a 404 error
    if (!template) {
      return NextResponse.json(
        {
          success: false,
          error: "Template not found",
        },
        { status: 404 }
      );
    }
    // Return the template data
    return NextResponse.json({
      success: true,
      data: template,
    });
  } catch (error) {
    console.error("Error fetching template:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// Function to update a template

export async function PUT(request, { params }) {
  const id = params.id;
  const body = await request.json();
  const apiKey = request.headers.get("x-api-key");

  try {
    // confirm the key in header
    if (apiKey !== process.env.VIBE_INVOICE_TEMPLATE_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    await connectDB();

    // Find the template by ID and update it
    const updatedTemplate = await Template.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    // If template is not found, return a 404 error
    if (!updatedTemplate) {
      return NextResponse.json(
        {
          success: false,
          error: "Template not found",
        },
        { status: 404 }
      );
    }

    // Return the updated template data
    return NextResponse.json({
      success: true,
      data: updatedTemplate,
    });
  } catch (error) {
    console.error("Error updating template:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
