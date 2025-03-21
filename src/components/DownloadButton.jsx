import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "./InvoicePDF";

export function DownloadButton({ invoice }) {
  return (
    <PDFDownloadLink
      document={<InvoicePDF invoice={invoice} />}
      fileName="invoice.pdf"
    >
      {({ loading }) => (
        <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded shadow">
          {loading ? "Generating PDF..." : "Download PDF"}
        </button>
      )}
    </PDFDownloadLink>
  );
}
