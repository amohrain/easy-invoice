import crypto from "crypto";
import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
const client = await clerkClient();

export async function POST(req) {
  const { userId } = await auth();
  const body = await req.json();
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } =
    body;
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

  // Payment is valid, update Clerk metadata
  await client.users.updateUserMetadata(userId, {
    publicMetadata: { plan: plan },
  });

  return Response.json({ success: true });
}
