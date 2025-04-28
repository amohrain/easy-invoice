"use client";
import { Download } from "lucide-react";
import { generatePdfDocDefinition } from "@/lib/generatePdfDocDefinition";
import { useInvoiceStore } from "@/store/useInvoice";
import { useTemplateStore } from "@/store/useTemplate";
import { getPdfMake } from "../lib/pdfmake.js";

export default function DownloadIcon({ button }) {
  const { template } = useTemplateStore();
  const { invoice } = useInvoiceStore();

  const handleDownload = async () => {
    const pdfMake = await getPdfMake();

    // Convert logo image to base64 if needed
    const logoUrl = invoice.businessLogo;
    if (logoUrl && !logoUrl.startsWith("data:image")) {
      const res = await fetch(logoUrl);
      const blob = await res.blob();
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
      invoice.businessLogo = base64;
    }

    const docDefinition = generatePdfDocDefinition(template, invoice);
    console.log("Doc Definition:", docDefinition);
    pdfMake.createPdf(docDefinition).open();
    // pdfMake.createPdf(docDefinition).download("invoice.pdf");
  };

  if (!button) {
    return (
      <Download
        className="cursor-pointer hover:text-accent"
        onClick={handleDownload}
      />
    );
  }

  return (
    <button className="btn btn-success">
      <Download className="cursor-pointer" onClick={handleDownload} />
      Download
    </button>
  );
}
