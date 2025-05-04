export function formatCurrency(amount, currency = "USD") {
  const currencyLocaleMap = {
    INR: "en-IN",
    USD: "en-US",
    EUR: "en-IE",
    GBP: "en-GB",
    JPY: "ja-JP",
    CNY: "zh-CN",
    AUD: "en-AU",
    CAD: "en-CA",
    // Add more as needed
  };

  const locale = currencyLocaleMap[currency] || "en-US";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
