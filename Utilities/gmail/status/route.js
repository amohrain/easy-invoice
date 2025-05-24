import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import GmailToken from "../../../../models/gmailToken.model";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ connected: false });

  await connectDB();
  const token = await GmailToken.findOne({ userId });

  console.log(token);

  return NextResponse.json({ connected: !!token });
}
