// File: app/api/templates/route.js
import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";
import Template from "../../../models/template.model";

export async function POST(request) {
  try {
    // confirm the key in header
    const apiKey = request.headers.get("x-api-key");
    if (apiKey !== "762556b8-4c2f-4a0e-8d3b-1f5a7c6e9d3f") {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    // Connect to the database
    await connectDB();

    // Parse the request body
    const templateData = await request.json();

    // Create a new template
    const template = new Template(templateData);
    await template.save();

    // Return the created template
    return NextResponse.json(
      {
        success: true,
        data: template,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating template:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    // Connect to the database
    await connectDB();

    // // Get URL parameters
    // const { searchParams } = new URL(request.url);
    // const id = searchParams.get("id");

    // // If ID is provided, get a specific template
    // if (id) {
    //   const template = await Template.findOne({ id });

    //   if (!template) {
    //     return NextResponse.json(
    //       {
    //         success: false,
    //         error: "Template not found",
    //       },
    //       { status: 404 }
    //     );
    //   }

    //   return NextResponse.json({
    //     success: true,
    //     data: template,
    //   });
    // }

    // Otherwise, get all templates
    const templates = await Template.find({});

    return NextResponse.json({
      success: true,
      data: templates,
    });
  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
