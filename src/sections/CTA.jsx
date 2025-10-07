import Link from "next/link";
import React from "react";

function CTA() {
  return (
    <div className="bg-secondary py-12 rounded-4xl">
      <div className="flex flex-col gap-6 text-secondary-content items-center">
        <h2 className="text-center py-2 text-4xl md:text-6xl font-bold tracking-tighter">
          Ready to skip manual invoicing?
        </h2>
        <p className="self-center italic section-description sm:w-full w-72">
          Try Vibe Invoice today
        </p>
        <Link href="/sign-up">
          <button className="btn btn-lg sm:btn-xl rounded-full">
            Get started for free
          </button>
        </Link>
        <p className="italic underline">No credit card required.</p>
      </div>
    </div>
  );
}

export default CTA;
