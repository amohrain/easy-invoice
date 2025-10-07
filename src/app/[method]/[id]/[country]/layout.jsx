import { countries } from "../../../../data/countries";
import { methods } from "../../../../data/method";
import { PROFESSION_PAGES } from "../../../../data/profession";

// export async function generateMetadata({ params }) {
//   const { id, country } = await params;
//   const profession = PROFESSION_PAGES.find((p) => p.id === id);
//   const nation = countries.find((c) => c.id === country);

//   console.log(nation?.text);

//   return {
//     title:
//       profession?.title + nation?.text || "Invoice template | Vibe Invoice",
//     description:
//       profession?.description + nation?.text + "." ||
//       "Create invoice tailored for your profession in seconds",
//     keywords: profession?.keywords
//       .map((keyword) => keyword + nation?.text)
//       .join(", "),
//     openGraph: {
//       title:
//         profession?.title + nation?.text || "Invoice template | Vibe Invoice",
//       description:
//         profession?.description + nation?.text ||
//         "Create invoice tailored for your profession in seconds",
//       url: `https://vibeinvoice.com/template/${id}`,
//     },
//   };
// }

export async function generateMetadata({ params }) {
  const { method, id, country } = await params;
  const profession = PROFESSION_PAGES.find((p) => p.id === id);
  const currentMethod = methods.find((m) => m.id === method);
  const nation = countries.find((c) => c.id === country);

  const title =
    currentMethod?.name + " for " + profession?.title + " " + nation.text ||
    "Invoice generator | Vibe Invoice";

  const description =
    profession?.description + nation?.text + "." ||
    "Create invoice tailored for your profession in seconds";

  return {
    title,
    description,
    keywords: profession?.keywords.map((keyword) => keyword).join(", "),
    openGraph: {
      title,
      description,
      url: `https://vibeinvoice.com/${method}/${id}`,
    },
  };
}

export default function TemplateLayout({ children }) {
  return <>{children}</>;
}
