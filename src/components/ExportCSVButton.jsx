import React from "react";
import Papa from "papaparse";

function ExportCSVButton({ invoices, items, filename = "invoices.csv" }) {
  const handleExport = () => {
    if (!invoices || invoices.length === 0) {
      alert("No invoices to export.");
      return;
    }

    const invoicesToExport =
      items.length > 0
        ? invoices.filter((inv) => items.includes(inv._id))
        : invoices;

    console.log(invoicesToExport);

    // Flatten and clean up fields
    const formattedData = invoicesToExport.map((inv) => ({
      InvoiceID: inv.invoiceId,
      InvoiceNumber: inv.invoiceNumber,
      ClientName: inv.clientName,
      IssuedAt: inv.issuedAt,
      TotalAmount: inv.totalAmount,
      Status: inv.status,
      Notes: inv.notes,
    }));

    const csv = Papa.unparse(formattedData);

    // Create a downloadable link
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button className="btn btn-ghost" onClick={handleExport}>
      Export CSV
    </button>
  );
}

export default ExportCSVButton;
