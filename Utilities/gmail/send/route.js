import { google } from "googleapis";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import GmailToken from "../../../../models/gmailToken.model";
import connectDB from "../../../../lib/mongodb";

export async function POST(req) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const tokenDoc = await GmailToken.findOne({ userId });
  if (!tokenDoc)
    return NextResponse.json({ error: "Gmail not connected" }, { status: 401 });

  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/gmail/callback`
  );
  oAuth2Client.setCredentials(tokenDoc.toObject());

  // Refresh if token expired
  if (Date.now() > tokenDoc.expiry_date) {
    const newTokens = await oAuth2Client.refreshAccessToken();
    oAuth2Client.setCredentials(newTokens.credentials);

    await GmailToken.updateOne({ userId }, newTokens.credentials);
  }

  const gmail = google.gmail({ version: "v1", auth: oAuth2Client });
  const { to, subject, html } = await req.json();

  const rawMessage = Buffer.from(
    `To: ${to}\r\n` +
      `Subject: ${subject}\r\n` +
      `Content-Type: text/html; charset=utf-8\r\n\r\n` +
      `${html}`
  )
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const emailSent = await gmail.users.messages.send({
    userId: "me",
    requestBody: { raw: rawMessage },
  });

  // Check if email is sent
  if (emailSent.status !== 200) {
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
