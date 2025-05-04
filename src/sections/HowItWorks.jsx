import React from "react";
// import sampleVideo from "../assets/HowItWorks.mp4";

function HowItWorks() {
  return (
    <div className="flex md:flex-row flex-col justify-center w-full gap-4">
      <div className="join join-vertical bg-base-100 max-w-lg">
        <div className="collapse collapse-arrow join-item border-base-300 border">
          <input type="radio" name="my-accordion-4" defaultChecked />
          <div className="collapse-title font-bold text-xl">
            Start with a prompt
          </div>
          <div className="collapse-content text-md">
            <p>Type "@client" to instantly pull client details</p>
            <p>Add items with natural language: "10 Logos @ $99"</p>
            <p>Enter tax details and click generate</p>
          </div>
        </div>
        <div className="collapse collapse-arrow join-item border-base-300 border">
          <input type="radio" name="my-accordion-4" defaultChecked={false} />
          <div className="collapse-title font-semibold text-xl">
            Preview and share
          </div>
          <div className="collapse-content text-md">
            <p>Fine tune the invoice and give it human touch. </p>
            <p>Edit names, items, prices, VAT & more</p>
            <p>Share and download on a click</p>
          </div>
        </div>
        <div className="collapse collapse-arrow join-item border-base-300 border">
          <input type="radio" name="my-accordion-4" defaultChecked={false} />
          <div className="collapse-title font-semibold text-xl">
            Collaborate
          </div>
          <div className="collapse-content text-md">
            <p>One-click sharing via link or download</p>
            <p>Real-time client feedback and approvals</p>
            <p>Minimize communication gaps for faster payments</p>
          </div>
        </div>
      </div>
      <div className="rounded p-4 bg-base-200">
        <video
          className="rounded w-100"
          autoPlay
          controls
          download="false"
          loop
          muted
        >
          <source src="/sample.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}

export default HowItWorks;
