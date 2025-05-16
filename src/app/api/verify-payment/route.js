import crypto from "crypto";
import { auth } from "@clerk/nextjs/server";
import { getMongoUser } from "../../../lib/getMongoUser";
import Company from "../../../models/company.model";
import Invoice from "../../../models/invoice.model";
import User from "../../../models/user.model";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { userId } = await auth();
  const user = await getMongoUser(userId);
  const body = await req.json();
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    plan,
    currency,
    amount,
  } = body;
  // Verify signature
  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (generated_signature !== razorpay_signature) {
    return NextResponse.json(
      { success: false, message: "Invalid payment signature" },
      { status: 400 }
    );
  }

  // Fetch user's company details
  const company = await Company.findById(user.company);
  const {
    businessName,
    businessEmail,
    businessAddress,
    businessPhone,
    businessTaxId,
  } = company;

  const invoiceData = {
    clientName: businessName,
    clientEmail: businessEmail,
    clientAddress: businessAddress,
    clientPhone: businessPhone,
    clientTaxId: businessTaxId,
    currency,
    notes: "Thank you for your support!",
    status: "Paid",
    items: [
      {
        description: `Vibe Invoice ${plan} Plan`,
        quantity: 1,
        rate: amount / 100,
      },
    ],
  };

  const response = await fetch(
    "http://www.vibeinvoice.com/api/invoice/generate-invoice",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": `${process.env.VIBE_INVOICE_API_KEY}`,
      },
      body: JSON.stringify(invoiceData),
    }
  );

  const data = await response.json();
  console.log(data);
  const invoiceUrl = data.invoiceUrl;

  // Payment is valid, update Clerk metadata
  user.subscriptionPlan = plan;
  user.invoice = invoiceUrl;
  await user.save();

  return NextResponse.json(
    { success: true, data: invoiceUrl },
    { status: 200 }
  );
}
