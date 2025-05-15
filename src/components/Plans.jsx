import useUserCountry from "../hooks/useUserCountry";
import PricingPlan from "./PricingPlan";

export default function Plans(where) {
  const country = useUserCountry();
  const isIndia = country === "IN";
  const currency = isIndia ? "INR" : "USD";

  return (
    <div className="flex flex-col lg:flex-row justify-center w-full gap-6">
      <PricingPlan
        name="Free"
        amount={0}
        mostPopular={false}
        features={[
          "15 Invoices per month",
          "Maximum 10 clients",
          "Supports one business",
          "Basic Templates",
        ]}
        where={where}
        currency={currency}
      />
      <PricingPlan
        name="Starter"
        amount={isIndia ? 3999 : 49.99}
        currency={currency}
        mostPopular={true}
        features={[
          "Unlimited invoices",
          "Unlimited clients",
          "Supports one business",
          "Access to exclusive templates",
          "Ad free expreience",
        ]}
        where={where}
      />
      <PricingPlan
        name="Pro"
        amount={isIndia ? 6599 : 79.99}
        currency={currency}
        mostPopular={false}
        features={[
          "Unlimited invoices",
          "Unlimited clients",
          "Unlimited businesses",
          "Create Own Templates",
        ]}
        where={where}
      />
    </div>
  );
}
