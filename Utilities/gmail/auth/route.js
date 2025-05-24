// app/api/gmail/auth/route.js
import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function GET() {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/gmail/callback`
  );

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["https://www.googleapis.com/auth/gmail.send"],
  });

  return NextResponse.redirect(authUrl);
}
