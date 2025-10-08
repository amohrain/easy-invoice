"use client";
import { notFound, useParams } from "next/navigation";
import { methods } from "../../data/method";
import { PROFESSION_PAGES } from "../../data/profession";
import PSEOPage from "../../components/PSEOPage";

function page() {
  const { method } = useParams();
  const currentMethod = methods.find((m) => m.id === method);

  if (!currentMethod?.name) return notFound();

  const headline = currentMethod.name + " for busy professionals (Free)";
  const name = "your profession";
  const prompt =
    PROFESSION_PAGES[Math.floor(Math.random() * PROFESSION_PAGES.length)]
      .prompt;

  const links = PROFESSION_PAGES.map((profession) => ({
    title: currentMethod.name + " for " + profession.name,
    url: `/${method}/${profession.id}`,
  }));

  return (
    <PSEOPage headline={headline} name={name} prompt={prompt} links={links} />
  );
}

export default page;
