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
          "15 AI Documents per month",
          "Upto 250 words per prompt",
          "Unlimited non-AI Documents",
          "Lifetime access",
        ]}
        where={where}
      />
      <PricingPlan
        name="Starter"
        amount={550}
        price="Rs. 550/-"
        mostPopular={true}
        features={[
          "Everything in free",
          "Unlimited words per prompt",
          "Monthly 100 AI Generated Documents",
          "Email support",
        ]}
        where={where}
      />
      <PricingPlan
        name="Pro"
        amount={850}
        price="Rs. 850"
        mostPopular={false}
        features={[
          "Everything in starter",
          "Unlimited AI Generated Documents",
          "Lifetime access",
          "Priority Support",
        ]}
        where={where}
      />
    </div>
  );
}
