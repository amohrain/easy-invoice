import PricingPlan from "./PricingPlan";

export default function Plans(where) {
  return (
    <div className="p-4 self-center flex flex-row flex-wrap gap-6">
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
        amount={550}
        price="$49.99"
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
        amount={850}
        price="$99.99"
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
