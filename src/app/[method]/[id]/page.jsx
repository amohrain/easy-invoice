"use client";
import { notFound, useParams } from "next/navigation";
import { PROFESSION_PAGES } from "../../../data/profession";
import { methods } from "../../../data/method";
import { countries } from "../../../data/countries";
import PSEOPage from "../../../components/PSEOPage";

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
    <PSEOPage headline={headline} name={name} prompt={prompt} links={links} />
  );
}

export default page;
