import { ExternalLink } from "lucide-react";
import React, { useState } from "react";

function HowItWorks() {
  const [imgSrc, setImgSrc] = useState("/step-prompt.png");
  const handleChange = (event) => {
    setImgSrc(event.target.value);
  };

  return (
    <section
      id="how-it-works"
      className="w-full flex flex-col items-center justify-center gap-8 p-4 pt-12 sm:px-4 sm:py-24"
    >
      <div className="section-heading">
        <h2 className="section-title">How it works</h2>
        <p className="section-description italic mt-5">in three simple steps</p>
      </div>
      <div className="flex md:flex-row flex-col items-center justify-center w-full gap-4">
        <div className="join text-lg join-vertical rounded-2xl overflow-hidden shadow-lg max-w-lg">
          <div className="rounded-t-2xl collapse collapse-arrow join-item border-base-300 border">
            <input
              type="radio"
              className="peer"
              name="my-accordion-4"
              defaultChecked={true}
              value="/step-prompt.png"
              onChange={handleChange}
            />
            <div className="collapse-title font-semibold peer-checked:text-primary text-xl">
              Start with a prompt
            </div>
            <div className="collapse-content text-md">
              <p>
                Type{" "}
                <span className="text-info cursor-pointer italic">@client</span>{" "}
                to instantly pull client details
              </p>
              <p>Add items with natural language like-</p>
              <p className="italic p-4">"10 Logos @ $99"</p>
              <p>Enter tax details and click generate</p>
            </div>
          </div>
          <div className="collapse collapse-arrow join-item border-base-300 border">
            <input
              type="radio"
              className="peer"
              name="my-accordion-4"
              defaultChecked={false}
              value="/step-preview.png"
              onChange={handleChange}
            />
            <div className="rounded-b-2xl collapse-title font-semibold peer-checked:text-primary text-xl">
              Preview and share
            </div>
            <div className="collapse-content text-md">
              <p>Fine tune the invoice and give it human touch. </p>
              <p>Edit names, items, prices, VAT & more</p>
              <p>Share and download on a click</p>
            </div>
          </div>
          <div className="collapse collapse-arrow join-item border-base-300 border">
            <input
              type="radio"
              className="peer"
              name="my-accordion-4"
              defaultChecked={false}
              value="/step-collaborate.png"
              onChange={handleChange}
            />
            <div className="collapse-title font-semibold peer-checked:text-primary text-xl">
              Collaborate
            </div>
            <div className="collapse-content text-md">
              <p>One-click sharing via link or download</p>
              <p>Real-time client feedback and approvals</p>
              <p>Minimize communication gaps for faster payments</p>
            </div>
          </div>
        </div>
        <div className="p-4 max-w-[478px]">
          <img
            className="border border-base-300 shadow-lg rounded-xl"
            src={imgSrc}
            alt={imgSrc}
          />
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
