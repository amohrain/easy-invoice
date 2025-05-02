"use client";
import { Download } from "lucide-react";
import { generatePdfDocDefinition } from "@/lib/generatePdfDocDefinition";
import { useInvoiceStore } from "@/store/useInvoice";
import { useTemplateStore } from "@/store/useTemplate";
import { getPdfMake } from "../lib/pdfmake.js";
import { toast } from "sonner";

export default function DownloadIcon({}) {
  const { template } = useTemplateStore();
  const { invoice, suggestion } = useInvoiceStore();

  const handleDownload = async (invoice, suggestion) => {
    console.log("Suggestion, ", suggestion);
    const pdfMake = await getPdfMake();
    let updatedInvoice = { ...invoice };

    if (suggestion) {
      updatedInvoice = { ...invoice, ...suggestion };
    }

    console.log("updated invoice: ", updatedInvoice);

    // Convert logo image to base64 if needed
    const logoUrl = updatedInvoice.businessLogo;
    if (logoUrl && !logoUrl.startsWith("data:image")) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        const res = await fetch(logoUrl, { signal: controller.signal });
        clearTimeout(timeout);

        if (!res.ok) throw new Error("Image fetch failed");

        const blob = await res.blob();
        const base64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });

        updatedInvoice.businessLogo = base64;
      } catch (err) {
        toast.error("Business logo failed to load. Proceeding without it.");
        updatedInvoice.businessLogo = null;
      }
    }
    const docDefinition = generatePdfDocDefinition(template, updatedInvoice);
    console.log("Doc Definition:", docDefinition);
    pdfMake.createPdf(docDefinition).open();
    // pdfMake.createPdf(docDefinition).download("invoice.pdf");
  };

  if (suggestion)
    return (
      <div className="dropdown dropdown-end">
        <div
          tabIndex={0}
          role="button"
          className="m-1 cursor-pointer hover:text-accent"
        >
          <Download />
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-52"
        >
          <li>
            <button onClick={() => handleDownload(invoice)}>
              Download Original
            </button>
          </li>
          <li>
            <button onClick={() => handleDownload(invoice, suggestion)}>
              Download Suggested
            </button>
          </li>
        </ul>
      </div>
    );

  return (
    <Download
      className="cursor-pointer hover:text-accent"
      onClick={() => handleDownload(invoice)}
    />
  );
}
