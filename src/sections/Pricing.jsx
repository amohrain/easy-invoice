import React from "react";
import Plans from "@/components/Plans";
import { Clock } from "lucide-react";

function Pricing() {
  return (
    <section
      id="pricing"
      className="min-h-screen bg-gradient-to-b from-base-100 to-primary/0 w-full flex flex-col items-center justify-center gap-12 p-4 sm:px-4 sm:py-12"
    >
      <div
        className="flex flex-col
      section-heading"
      >
        <h2 className="section-title">One-time payment and Zero commitments</h2>
        <div className="animate-pulse self-center badge badge-xl font-light badge-secondary gap-2">
          <Clock className="" size={18} />
          67% off for a limited time!
        </div>
      </div>
      <Plans where="home" />
    </section>
  );
}

export default Pricing;
