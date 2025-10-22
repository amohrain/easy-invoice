import { AtSign, Sparkles } from "lucide-react";
import React from "react";
import HoverClientCard from "../components/HoverClientCard";

function HowItWorksCards() {
  const steps = [
    {
      title: "@Tag your client",
      step: "1",
      description: (
        <ul className="flex flex-col gap-4 items-center">
          <li
            tabIndex={-1}
            className="dropdown dropdown-hover items-center justify-center"
          >
            Write{" "}
            <span
              role="button"
              className="badge mt-[-5px] py-4.5 gap-0 italic badge-primary opacity-70 badge-xl rounded-full px-2 cursor-pointer font-bold"
            >
              @Name
            </span>{" "}
            <HoverClientCard />
            to mention client.
          </li>
          <li>Just like tagging someone in a comment</li>
          {/* <li>Add your invoice items like-</li>
          <span className="italic p-2">"5 Logos @ $99"</span>
          <li>Click Generate when ready</li> */}
        </ul>
      ),
      img: "/step-prompt.png",
    },
    {
      title: "Add your items",
      step: "2",
      description: (
        <ul className="flex flex-col gap-4 items-center">
          <li className="py-4.5 mt-[-5px] badge badge-secondary opacity-80 badge-xl rounded-full cursor-pointer font-medium">
            5 Logos @ 99.99
          </li>
          <li>Describe your work naturally. The AI formats it into invoice.</li>
        </ul>
      ),
      img: "/step-preview.png",
    },
    {
      title: "Generate Invoice",
      step: "3",
      description: (
        <ul className="flex flex-col gap-4 items-center">
          <li className="items-center justify-center">
            Hit{" "}
            <span
              tabIndex={0}
              role="button"
              className="px-3 gap-1 py-4.5 mt-[-5px] badge badge-xl bg-gradient-to-tr from-secondary via-secondary/85 to-primary opacity-80 text-base-100 rounded-full cursor-pointer font-medium"
            >
              <Sparkles className="size-4" />
              Generate
            </span>{" "}
            button
          </li>
          <li> Watch your invoice come to life in a few seconds.</li>
        </ul>
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
            className="relative flex flex-col max-w-sm items-center text-center p-6 rounded-2xl shadow-2xl bg-base-100/50 transition-shadow"
          >
            {/* <img
              src={step.img}
              alt={step.title}
              className="rounded-xl shadow-xl mb-4"
            /> */}
            <h3 className="gradient-text font-semibold text-3xl my-8">
              {step.title}
            </h3>
            <div className="text-xl space-y-1 leading-[30px] tracking-tight mb-4">
              {step.description}
            </div>
            <div className="absolute badge badge-primary rounded-none rounded-bl-2xl rounded-tr-2xl opacity-50 flex bottom-0 left-0 px-4 py-2">
              <span className="italic text-md">Step {step.step}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HowItWorksCards;
