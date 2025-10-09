import useUserCountry from "../hooks/useUserCountry";
import PricingPlan from "./PricingPlan";

export default function Plans(where) {
  const country = useUserCountry() || "US";
  const isIndia = country === "IN";
  // const isIndia = false; // Forcing USD for all users
  const currency = isIndia ? "INR" : "USD";

  const plans = [
    {
      name: "Free",
      amount: 0,
      mrp: null,
      mostPopular: false,
      features: [
        "10 Invoices per month",
        "Maximum 10 clients",
        "Limited invoice storage",
        // "100 API calls per month",
      ],
    },
    {
      name: "Starter",
      amount: isIndia ? 3999 : 49.99,
      mrp: isIndia ? 11999 : 149.99,
      mostPopular: true,
      features: [
        "Unlimited invoices",
        "Unlimited clients",
        "Supports one business",
        "Unlimited invoice storage",
        "Lifetime Access",
        // "Access to exclusive templates",
        // "Unlimited API calls*",
      ],
    },
    {
      name: "Pro",
      amount: isIndia ? 7999 : 99.99,
      mrp: isIndia ? 23999 : 299.99,
      mostPopular: false,
      features: [
        "Unlimited invoices",
        "Unlimited clients",
        "Unlimited businesses",
        "Lifetime Access",
        // "Create Own Templates",
      ],
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row justify-center w-full gap-12">
      {plans.map((plan, index) => (
        <PricingPlan
          key={index}
          name={plan.name}
          amount={plan.amount}
          mrp={plan.mrp}
          mostPopular={plan.mostPopular}
          features={plan.features}
          where={where}
          currency={currency}
        />
      ))}
    </div>
  );
}
