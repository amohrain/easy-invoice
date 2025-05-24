// File: app/api/templates/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Template from "@/models/template.model";
import { auth } from "@clerk/nextjs/server";
import { getMongoUser } from "@/lib/getMongoUser";

export async function POST(request) {
  try {
    // confirm the key in header
    const apiKey = request.headers.get("x-api-key");
    if (apiKey !== process.env.VIBE_INVOICE_TEMPLATE_API_KEY) {
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

    // Get URL parameters
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("userId");

    // If userId is provided, get templates for that user
    if (id) {
      // authenticate the user
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

      const templates = user.templates;
      return NextResponse.json({
        success: true,
        data: templates,
      });
    }

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
