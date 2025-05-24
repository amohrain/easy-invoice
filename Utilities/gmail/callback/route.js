import { google } from "googleapis";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import GmailToken from "../../../../models/gmailToken.model";
import connectDB from "../../../../lib/mongodb";

export async function GET(req) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/gmail/callback`
  );

  const { tokens } = await oAuth2Client.getToken(code);

  await connectDB();
  await GmailToken.findOneAndUpdate(
    { userId },
    { ...tokens },
    { upsert: true, new: true }
  );

  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`);
}
