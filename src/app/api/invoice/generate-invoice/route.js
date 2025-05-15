import { NextResponse } from "next/server";
import Company from "../../../../models/company.model";
import Invoice from "../../../../models/invoice.model";
import User from "../../../../models/user.model";
import { calculateInvoice } from "../../../../lib/calculate";
import { z } from "zod";

export async function POST(request) {
  const start = performance.now();
  const apiKey = await request.headers.get("x-api-key");
  console.log(apiKey);

  // Fetch invoice details from the request body

  const {
    clientName,
    clientEmail,
    clientAddress,
    clientPhone,
    clientTaxId,
    items,
    additions,
    deductions,
    status,
    notes,
  } = await request.json();

  // console.log("items", items, "additions", additions, "deductions", deductions);

  const ItemSchema = z.array(
    z.object({
      description: z.string().min(1),
      quantity: z.number().nonnegative(),
      rate: z.number().nonnegative(),
    })
  );

  const AdjustmentSchema = z
    .array(
      z.object({
        description: z.string().min(1),
        amount: z.number().optional(),
        percent: z.number().optional(),
      })
    )
    .optional()
    .or(z.literal(null));

  // Validate the request body against the schema
  const validation =
    ItemSchema.safeParse(items) &&
    AdjustmentSchema.safeParse(additions) &&
    AdjustmentSchema.safeParse(deductions);

  console.log(validation);

  if (!validation.success) {
    return NextResponse.json({
      success: false,
      message: validation.error.errors[0].message,
    });
  }

  if (items.length === 0) {
    return NextResponse.json({
      success: false,
      message: "Items cannot be empty",
    });
  }

  // Fetch user's company details
  const company = await Company.findOne({ apiKey });

  if (!company) {
    return NextResponse.json({
      success: false,
      message: "Invalid API key",
    });
  }

  const {
    businessName,
    businessEmail,
    businessAddress,
    businessPhone,
    businessTaxId,
  } = company;

  const user = await User.findById(company.user);

  // Get the last invoice number from the database
  const lastInvoice = await Invoice.findOne({
    company,
    invoiceId: { $exists: true },
  }).sort({ invoiceId: -1 });

  // Generate the next invoice number
  const nextInvoiceId = lastInvoice ? lastInvoice.invoiceId + 1 : 1001;

  // Logic to create invoice
  const newInvoice = {
    user: company.user,
    company,
    template: user.template,
    invoiceTitle: "Invoice",
    invoiceId: nextInvoiceId,
    currency: company.currency || "USD",
    businessName,
    businessEmail,
    businessAddress,
    businessPhone,
    businessTaxId,
    clientName,
    clientEmail,
    clientAddress,
    clientPhone,
    clientTaxId,
    issuedAt: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    invoiceNumber: "INV-" + nextInvoiceId,
    notes,
    status,
    additions,
    deductions,
    items,
  };

  const invoice = calculateInvoice(newInvoice);

  const end = performance.now();
  const durationInSeconds = ((end - start) / 1000).toFixed(2);
  invoice.timeTaken = parseFloat(durationInSeconds); // save to DB

  const generatedInvoice = await Invoice.create(invoice);
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/view/${generatedInvoice._id}`;

  return Response.json({
    success: true,
    message: "Invoice created successfully!",
    data: url,
  });
}
