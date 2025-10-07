import { methods } from "../../data/method";

export async function generateMetadata({ params }) {
  const { method } = await params;
  const currentMethod = methods.find((m) => m.id === method);

  const title =
    currentMethod?.name + " for busy professionals" ||
    "Invoice generator | Vibe Invoice";

  const description = "Create invoice tailored for your profession in seconds";

  return {
    title,
    description,
    keywords: currentMethod?.keywords,
    openGraph: {
      title,
      description,
      url: `https://vibeinvoice.com/${method}`,
    },
  };
}

export default function TemplateLayout({ children }) {
  return <>{children}</>;
}
