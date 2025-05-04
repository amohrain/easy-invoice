import crypto from "crypto";
import { auth } from "@clerk/nextjs/server";
import { getMongoUser } from "../../../lib/getMongoUser";
import Company from "../../../models/company.model";
import Invoice from "../../../models/invoice.model";
import User from "../../../models/user.model";

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
    return Response.json(
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

  const admin = await User.findById(process.env.ADMIN_USER_ID);

  // Get the last invoice number from the database
  const lastInvoice = await Invoice.findOne({
    company: admin.company,
    invoiceId: { $exists: true },
  }).sort({ invoiceId: -1 });

  // Generate the next invoice number
  const nextInvoiceId = lastInvoice ? lastInvoice.invoiceId + 1 : 1001;

  // Logic to create invoice
  const invoice = await Invoice.create({
    user: admin._id,
    company: admin.company,
    template: admin.template,
    invoiceTitle: "Invoice",
    invoiceId: nextInvoiceId,
    currency,
    businessName: "Vibe Invoice",
    businessEmail: "abhishek@vibeinvoice.com",
    businessAddress: "A-249, Rama Market, Munirka, New Delhi",
    businessPhone: "",
    businessTaxId: "",
    clientName: businessName,
    clientEmail: businessEmail,
    clientAddress: businessAddress,
    clientPhone: businessPhone,
    clientTaxId: businessTaxId,
    issuedAt: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    invoiceNumber: "INV-" + nextInvoiceId,
    subtotal: amount / 100,
    totalAmount: amount / 100,
    notes: "Thank you for your support!",
    status: "Paid",
    items: [
      {
        description: `Vibe Invoice ${plan} Plan`,
        quantity: 1,
        rate: amount / 100,
        total: amount / 100,
      },
    ],
  });

  // Payment is valid, update Clerk metadata
  user.subscriptionPlan = plan;
  user.invoice = invoice._id;
  await user.save();

  return Response.json({ success: true, data: invoice._id });
}
