import React from "react";
import PaymentButton from "./PaymentButton";
import { useRouter } from "next/navigation";

function PricingPlan({ name, price, mostPopular, features, amount, where }) {
  const router = useRouter();
  return (
    <div
      className={`card w-fit ${
        mostPopular ? "bg-neutral" : "bg-base-200"
      } shadow-sm`}
    >
      <div className="card-body min-w-[280px] w-full">
        <span
          className="badge badge-xs text-neutral badge-warning"
          style={{ visibility: mostPopular ? "visible" : "hidden" }}
        >
          Most Popular
        </span>
        <div className="flex flex-col justify-between">
          <h2
            className={`text-3xl font-bold ${
              mostPopular ? "text-neutral-content" : ""
            }`}
          >
            {name}
          </h2>
          <span
            className={`text-xl ${mostPopular ? "text-neutral-content" : ""}`}
          >
            {price}
          </span>
        </div>
        <ul
          className={`mt-6 flex flex-col gap-2 text-xs font-semibold ${
            mostPopular ? "text-neutral-content" : ""
          }`}
        >
          {features.map((feature, index) => (
            <li key={index}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-4 me-2 inline-block text-success"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <PaymentButton name={name} planAmount={amount * 100} where={where} />
        </div>
      </div>
    </div>
  );
}

export default PricingPlan;
