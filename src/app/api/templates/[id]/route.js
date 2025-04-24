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
