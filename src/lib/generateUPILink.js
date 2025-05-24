export function generateUPILink(upiId, amount) {
  if (!upiId || !amount) {
    throw new Error("UPI ID and amount are required");
  }

  const baseUrl = "upi://pay";
  const params = new URLSearchParams({
    pa: upiId, // Payee UPI ID
    am: amount.toFixed(2), // Amount in INR
    cu: "INR", // Currency
  });

  return `${baseUrl}?${params.toString()}`;
}
