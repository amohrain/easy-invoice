import React from "react";

function HowItWorksCards() {
  const steps = [
    {
      title: "Start with a prompt",
      step: "1",
      description: (
        <ul className="">
          <li>
            Type{" "}
            <span className="text-info cursor-pointer italic">@client</span> to
            mention a client.
          </li>
          <li>Add your invoice items like-</li>
          <span className="italic p-2">"5 Logos @ $99"</span>
          <li>Click Generate when ready</li>
        </ul>
      ),
      img: "/step-prompt.png",
    },
    {
      title: "Preview and share",
      step: "2",
      description: (
        <>
          <p>Review the generated invoice.</p>
          <p>Edit names, items, prices, VAT & more</p>
          <p>Share and download on a click</p>
        </>
      ),
      img: "/step-preview.png",
    },
    {
      title: "Collaborate",
      step: "3",
      description: (
        <>
          <p>Real-time client feedback</p>
          <p>Minimize communication gaps</p>
          <p>Get paid faster</p>
        </>
      ),
      img: "/step-collaborate.png",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="w-full flex flex-col items-center justify-center gap-8 p-4 pt-12 sm:px-4 sm:py-24"
    >
      <div className="section-heading text-center">
        <h2 className="section-title">How it works</h2>
        <p className="section-description italic mt-5">in three simple steps</p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-fit">
        {steps.map((step, i) => (
          <div
            key={i}
            className="flex flex-col max-w-sm items-center text-center p-6 rounded-2xl shadow-2xl bg-base-100/70 transition-shadow"
          >
            {/* <img
              src={step.img}
              alt={step.title}
              className="rounded-xl shadow-xl mb-4"
            /> */}
            <h3 className="gradient-text font-semibold text-3xl my-8">
              {step.title}
            </h3>
            <div className="text-xl space-y-1 leading-[30px] tracking-tight">
              {step.description}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HowItWorksCards;
