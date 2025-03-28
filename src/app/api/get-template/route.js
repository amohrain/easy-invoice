import connectDB from "@/lib/mongodb";
import Template from "@/models/template.model";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    connectDB();
    const templates = await Template.find({
      isPublic: true,
    });
    return NextResponse.json(templates);
  } catch (error) {
    return NextResponse.json({ status: 500, error: "Something went wrong" });
  }
}
