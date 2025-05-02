import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Company from "@/models/company.model";
import { auth } from "@clerk/nextjs/server";
import { getMongoUser } from "@/lib/getMongoUser";

// This function handles the POST request to create a new company

export async function POST(request) {
  try {
    // Connect to the database
    await connectDB();
    // Get the user ID from the request
    const { userId } = await auth();

    console.log("Clerk ID:", userId);

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

    console.log("Mongo User:", user);

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
    // Parse the request body
    const companyData = await request.json();
    // Create a new company
    const company = new Company({ ...companyData, user });
    await company.save();

    user.company = company._id;
    await user.save();

    // Return the created company
    return NextResponse.json(
      {
        success: true,
        data: company,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating company:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// This function handles the GET request to fetch all companies for a user

export async function GET() {
  try {
    // Connect to the database
    await connectDB();

    // Get the user ID from the request
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

    // Get all companies for the user
    const companies = await Company.find({ user });

    // get user's company

    const currentCompany = await Company.findById(user.company);

    // Return the companies
    return NextResponse.json({
      success: true,
      data: companies,
      company: currentCompany,
    });
  } catch (error) {
    console.error("Error fetching companies:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
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
    const companyId = searchParams.get("id");

    if (!companyId) {
      return NextResponse.json(
        {
          success: false,
          error: "Company ID is required",
        },
        { status: 400 }
      );
    }

    const company = await Company.findById(companyId);

    if (!company) {
      return NextResponse.json(
        {
          success: false,
          error: "Company not found",
        },
        { status: 404 }
      );
    }
    if (company.user.toLocaleString() !== user._id.toLocaleString()) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    // Delete the company
    await Company.deleteOne({ _id: companyId });

    return NextResponse.json({
      success: true,
      data: company,
    });
  } catch (error) {
    console.error("Error deleting company:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// This function handles the PUT request to update a company

export async function PUT(request) {
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

    // get companyId from query params
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get("id");

    if (!companyId) {
      return NextResponse.json(
        {
          success: false,
          error: "Company ID is required",
        },
        { status: 400 }
      );
    }

    const company = await Company.findById(companyId);

    if (!company) {
      return NextResponse.json(
        {
          success: false,
          error: "Company not found",
        },
        { status: 404 }
      );
    }
    // Check if the user is authorized to update the company
    if (company.user.toLocaleString() !== user._id.toLocaleString()) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const companyData = await request.json();

    await Company.updateOne({ _id: companyId }, { $set: companyData });

    return NextResponse.json({
      success: true,
      data: company,
    });
  } catch (error) {
    console.error("Error updating company:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
