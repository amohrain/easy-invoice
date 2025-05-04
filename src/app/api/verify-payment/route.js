import crypto from "crypto";
import { auth } from "@clerk/nextjs/server";
import { getMongoUser } from "../../../lib/getMongoUser";

export async function POST(req) {
  const { userId } = await auth();
  const user = await getMongoUser(userId);
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
  user.subscriptionPlan = plan;
  await user.save();

  return Response.json({ success: true });
}
