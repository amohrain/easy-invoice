"use client";
import { Download } from "lucide-react";
import { generatePdfDocDefinition } from "@/lib/generatePdfDocDefinition";
import { useInvoiceStore } from "@/store/useInvoice";
import { useTemplateStore } from "@/store/useTemplate";

export default function DownloadIcon() {
  const { template } = useTemplateStore();
  const { invoice } = useInvoiceStore();

  const handleDownload = async () => {
    const pdfMake = (await import("pdfmake/build/pdfmake")).default;
    const pdfFonts = await import("pdfmake/build/vfs_fonts");
    pdfMake.vfs = pdfFonts.vfs;

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
    pdfMake.createPdf(docDefinition).download("invoice.pdf");
  };

  return <Download className="cursor-pointer" onClick={handleDownload} />;
}
