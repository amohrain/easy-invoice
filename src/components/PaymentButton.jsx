import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

// PaymentButton Component
export default function PaymentButton({ name, planAmount, where }) {
  const page = where.where;
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const currentPlan = user?.publicMetadata?.plan;

  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => setRazorpayLoaded(true);
      document.body.appendChild(script);
    } else {
      setRazorpayLoaded(true);
    }
  }, []);

  const handlePayment = async () => {
    if (where === "home") return router.push("/sign-up");
    if (!razorpayLoaded) return alert("Payment system not loaded yet.");

    setLoading(true);
    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: planAmount }), // Send amount in body
      });

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

      const text = await res.text();
      if (!text) throw new Error("Empty response from server");

      const { orderId, currency, amount, key } = JSON.parse(text);

      const options = {
        key,
        amount,
        currency,
        name: "Bulkmark Payment",
        description: "One-time payment for Bulkmark access",
        order_id: orderId,
        handler: async function (response) {
          try {
            // Step 1: Verify Payment
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                plan: name,
              }),
              headers: { "Content-Type": "application/json" },
            });

            if (!verifyRes.ok) throw new Error("Payment verification failed");

            window.location.reload(); // Refresh to update payment status
          } catch (error) {
            console.error("Error handling payment:", error);
            alert("Something went wrong. Please contact support.");
          }
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment failed:", error);
      alert(error.message);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={() => {
        if (page === "home") {
          router.push("/sign-in");
        } else {
          handlePayment();
        }
      }}
      disabled={(planAmount == 0 && page !== "home") || name === currentPlan}
      className="btn btn-primary"
    >
      {currentPlan === name ? "Current Plan" : `Continue with ${name}`}
    </button>
  );
}
