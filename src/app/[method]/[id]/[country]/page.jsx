"use client";
import { notFound, useParams } from "next/navigation";
import { PROFESSION_PAGES } from "../../../../data/profession";
import { countries } from "../../../../data/countries";
import { methods } from "../../../../data/method";
import PSEOPage from "../../../../components/PSEOPage";

function page() {
  const { method, id, country } = useParams();
  const currentMethod = methods.find((m) => m.id === method);
  const profession = PROFESSION_PAGES.find((p) => p.id === id);
  const nation = countries.find((c) => c.id === country);

  if (!profession?.h1 || !currentMethod?.name || !nation?.text)
    return notFound();

  const headline =
    profession.h1 + " " + currentMethod.name + " (Free) " + nation.text;
  const name = profession.name ? profession.name.toLowerCase() : "freelancers";
  const prompt = profession ? profession.prompt : "";

  return (
    <PSEOPage headline={headline} name={name} prompt={prompt} links={null} />
  );
}

export default page;
