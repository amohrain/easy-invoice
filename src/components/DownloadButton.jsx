import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "./InvoicePDF";

export function DownloadButton({ invoice, template }) {
  return (
    <PDFDownloadLink
      document={<InvoicePDF invoice={invoice} template={template} />}
      fileName="invoice.pdf"
    >
      {({ loading }) => (
        <button className="btn btn-accent w-full">
          {loading ? "Generating PDF..." : "Download PDF"}
        </button>
      )}
    </PDFDownloadLink>
  );
}
