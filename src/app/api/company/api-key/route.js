import { v4 as uuidv4 } from "uuid";
import Company from "../../../../models/company.model";
import connectDB from "../../../../lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { companyId } = await req.json();
    if (!companyId) {
      return NextResponse.json({
        success: false,
        message: "Company ID is required",
      });
    }

    await connectDB();

    const company = await Company.findById(companyId);
    // Generate a unique API key using UUID
    const apiKey = uuidv4();

    company.apiKey = apiKey;
    await company.save();

    return NextResponse.json({
      success: true,
      message: "API key generated successfully",
      apiKey,
    });
  } catch (error) {
    console.error("Error generating API key:", error);
    return NextResponse.json({
      success: false,
      message: "An error occurred while generating the API key",
    });
  }
}

export async function DELETE(req) {
  try {
    const { companyId, apiKey } = await req.json();
    if (!companyId) {
      return NextResponse.json({
        success: false,
        message: "Company ID is required",
      });
    }

    await connectDB();

    const company = await Company.findById(companyId);
    if (!company) {
      return NextResponse.json({
        success: false,
        message: "Company not found",
      });
    }

    if (company.apiKey !== apiKey) {
      return NextResponse.json({
        success: false,
        message: "Invalid API key",
      });
    }

    company.apiKey = null;
    await company.save();

    return NextResponse.json({
      success: true,
      message: "API key deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting API key:", error);
    return NextResponse.json({
      success: false,
      message: "An error occurred while deleting the API key",
    });
  }
}
