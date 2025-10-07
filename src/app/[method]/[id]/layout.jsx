import { methods } from "../../../data/method";
import { PROFESSION_PAGES } from "../../../data/profession";

export async function generateMetadata({ params }) {
  const { method, id } = await params;
  const profession = PROFESSION_PAGES.find((p) => p.id === id);
  const currentMethod = methods.find((m) => m.id === method);

  const title =
    currentMethod?.name + " for " + profession?.title ||
    "Invoice generator | Vibe Invoice";

  const description =
    profession?.description + "." ||
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
