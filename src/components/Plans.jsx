import useUserCountry from "../hooks/useUserCountry";
import PricingPlan from "./PricingPlan";

export default function Plans(where) {
  const country = useUserCountry();
  const isIndia = country === "IN";

  return (
    <div className="flex flex-row justify-center flex-wrap w-full gap-6">
      <PricingPlan
        name="Free"
        amount={0}
        price="Forever"
        mostPopular={false}
        features={[
          "15 Invoices per month",
          "Maximum 10 clients",
          "Supports one business",
          "Basic Templates",
        ]}
        where={where}
      />
      <PricingPlan
        name="Starter"
        amount={isIndia ? 3999 : 49.99}
        price={
          isIndia
            ? `₹${new Intl.NumberFormat("en-IN").format(3999)}`
            : `$${new Intl.NumberFormat("en-US").format(49.99)}`
        }
        currency={isIndia ? "INR" : "USD"}
        mostPopular={true}
        features={[
          "Unlimited invoices",
          "Unlimited clients",
          "Supports one business",
          "Access to exclusive templates",
        ]}
        where={where}
      />
      <PricingPlan
        name="Pro"
        amount={isIndia ? 6599 : 79.99}
        price={
          isIndia
            ? `₹${new Intl.NumberFormat("en-IN").format(6599)}`
            : `$${new Intl.NumberFormat("en-US").format(79.99)}`
        }
        currency={isIndia ? "INR" : "USD"}
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
