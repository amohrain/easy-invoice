"use client";
import React, { useEffect, useState } from "react";
import { NavigationBar, FAQ, Footer, Pricing, CTA } from "../../../sections";
import { DynamicTextarea } from "../../../components/DynamicTextArea";
import { notFound, useParams } from "next/navigation";
import { PROFESSION_PAGES } from "../../../data/profession";
import { methods } from "../../../data/method";
import { countries } from "../../../data/countries";

function page() {
  const { method, id } = useParams();
  const currentMethod = methods.find((m) => m.id === method);
  const profession = PROFESSION_PAGES.find((p) => p.id === id);

  if (!profession?.h1 || !currentMethod?.name) return notFound();

  const headline = profession.h1 + " " + currentMethod.name + " (Free)";
  const name = profession.name ? profession.name.toLowerCase() : "freelancers";
  const prompt = profession ? profession.prompt : "";

  const links = countries.map((country) => ({
    title: currentMethod.name + " for " + profession.name + country.text,
    url: `/${method}/${profession.id}/${country.id}`,
  }));

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
            <p className="italic underline">
              Free plan includes 10 monthly invoices.
            </p>
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

export default page;
