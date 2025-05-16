import useUserCountry from "../hooks/useUserCountry";
import PricingPlan from "./PricingPlan";

export default function Plans(where) {
  const country = useUserCountry();
  const isIndia = country === "IN";
  const currency = isIndia ? "INR" : "USD";

  const plans = [
    {
      name: "Free",
      amount: 0,
      mostPopular: false,
      features: [
        "15 Invoices per month",
        "Maximum 10 clients",
        "Supports one business",
        "100 API calls per month",
      ],
    },
    {
      name: "Starter",
      amount: isIndia ? 3999 : 49.99,
      mostPopular: true,
      features: [
        "Unlimited invoices",
        "Unlimited clients",
        "Supports one business",
        "Access to exclusive templates",
        "Unlimited API calls*",
      ],
    },
    {
      name: "Pro",
      amount: isIndia ? 6500 : 99.99,
      mostPopular: false,
      features: [
        "Unlimited invoices",
        "Unlimited clients",
        "Unlimited businesses",
        "Create Own Templates",
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
          mostPopular={plan.mostPopular}
          features={plan.features}
          where={where}
          currency={currency}
        />
      ))}
    </div>
  );
}
