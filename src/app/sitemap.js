const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
import { methods } from "../data/method";
import { PROFESSION_PAGES } from "../data/profession";
import { countries } from "../data/countries";

export default async function sitemap() {
  const staticPages = [
    "/",
    "/about-us",
    "/contact-us",
    "/cookie-policy",
    "/docs",
    "/playground",
    "/privacy-policy",
    "/refund-policy",
    "/terms",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    // lastModified: "2024-12-31",
    changeFrequency: "monthly",
    priority: 1,
  }));

  const methodProfessionCountryPages = methods
    .map((method) =>
      PROFESSION_PAGES.map((profession) =>
        countries.map((country) => ({
          url: `${baseUrl}/${method.id}/${profession.id}/${country.id}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 1,
        }))
      ).flat(2)
    )
    .flat();

  const methodProfessionPages = methods
    .map((method) =>
      PROFESSION_PAGES.map((profession) => ({
        url: `${baseUrl}/${method.id}/${profession.id}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 1,
      }))
    )
    .flat();

  const methodPages = methods.map((method) => ({
    url: `${baseUrl}/${method.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 1,
  }));

  return [
    // Insert your hardcoded pages:
    ...staticPages,
    // Our pSEO pages:
    ...methodPages,
    ...methodProfessionPages,
    ...methodProfessionCountryPages,
  ];
}
