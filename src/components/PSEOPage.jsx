import React from "react";
import { DynamicTextarea } from "./DynamicTextArea";
import { CTA, FAQ, Footer, NavigationBar } from "../sections";

function PSEOPage({ headline, name, prompt, links }) {
  return (
    <main className="vibe-gradient">
      <NavigationBar />
      <section className="hero min-h-screen px-0 sm:px-4 vibe-gradient relative">
        <div className="hero-content flex-col gap-20 lg:flex-row-reverse">
          <div className="flex flex-col justify-between h-full gap-8 text-center">
            <div className="flex flex-col section-heading">
              <h1 className="self-center section-title">{headline}</h1>
              <p className="self-center section-description mt-5 sm:w-full w-72">
                Create invoices tailored for {name} in{" "}
                <span className="underline decoration-wavy decoration-secondary underline-offset-4">
                  one minute.
                </span>
              </p>
            </div>
            <DynamicTextarea prompt={prompt} />
          </div>
        </div>
      </section>

      {/* <Pricing /> */}
      <FAQ />
      <section className="bg-gradient-to-b from-base-300 to-base-100 p-4">
        <CTA />
      </section>
      <Footer links={links} />
    </main>
  );
}

export default PSEOPage;
