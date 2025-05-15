import React from "react";
import Plans from "@/components/Plans";

function Pricing() {
  return (
    <section
      id="pricing"
      className="min-h-screen bg-gradient-to-b from-base-100 to-primary/10 w-full flex flex-col items-center justify-center gap-12 p-4 sm:px-4 sm:py-12"
    >
      <div className="section-heading">
        <h2 className="section-title">One-time payment and no commitments</h2>
        <p className="section-description mt-5">
          All plans come with 30 day risk-free gurantee
        </p>
      </div>
      <Plans where="home" />
    </section>
  );
}

export default Pricing;
