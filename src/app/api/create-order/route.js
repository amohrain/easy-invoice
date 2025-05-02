import Razorpay from "razorpay";

export async function POST(req) {
  const { amount, currency } = await req.json();
  console.log("Type of amount:", typeof amount);
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const payment_capture = 1;

  const options = { amount, currency, payment_capture };
  const order = await razorpay.orders.create(options);

  return Response.json({
    orderId: order.id,
    amount,
    currency,
    key: process.env.RAZORPAY_KEY_ID,
  });
}
