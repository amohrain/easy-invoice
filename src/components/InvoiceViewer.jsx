// components/InvoiceViewer.js

import { useEffect, useState } from "react";
import { getPdfMake } from "../lib/pdfmake";
import { generatePdfDocDefinition } from "../lib/generatePdfDocDefinition";

async function prepareInvoice(invoice) {
  // Convert the logo to base64 if needed
  const getBase64Image = async (imageUrl) => {
    if (!imageUrl || imageUrl.startsWith("data:image/")) return imageUrl;

    const res = await fetch(imageUrl);
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const processedInvoice = {
    ...invoice,
    businessLogo: await getBase64Image(invoice.businessLogo),
  };

  return processedInvoice;
}

const InvoiceViewer = ({ invoice, template }) => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfMake, setPdfMake] = useState(null);
  const [docDefinition, setDocDefinition] = useState({});

  useEffect(() => {
    const run = async () => {
      const processedInvoice = await prepareInvoice(invoice);
      const docDefinition = generatePdfDocDefinition(
        template,
        processedInvoice
      );
      setDocDefinition(docDefinition);
    };

    run();
  }, []);

  useEffect(() => {
    const loadPdfMake = async () => {
      const pm = await getPdfMake();
      setPdfMake(pm);
    };
    loadPdfMake();
  }, []);

  useEffect(() => {
    if (!pdfMake) return;

    pdfMake.createPdf(docDefinition).getBlob((blob) => {
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    });
  }, [pdfMake, invoice]);

  const downloadPdf = () => {
    if (!pdfMake) return;
    pdfMake.createPdf(docDefinition).download("invoice.pdf");
  };

  return (
    <div>
      <button
        onClick={downloadPdf}
        className="px-4 py-2 bg-blue-500 text-white rounded mb-4"
      >
        Download PDF
      </button>

      {pdfUrl && (
        <iframe
          src={pdfUrl}
          width="100%"
          height="100%"
          title="Invoice PDF"
          className="border"
        />
      )}
    </div>
  );
};
export default InvoiceViewer;
