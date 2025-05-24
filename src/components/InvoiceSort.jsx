import React from "react";

function InvoiceSortDropdown({
  sortOption,
  setSortOption,
  invoiceData,
  setFilteredInvoices,
}) {
  const handleSortChange = (option) => {
    setSortOption(option);

    const sorted = [...invoiceData].sort((a, b) => {
      switch (option) {
        case "dateNewest":
          return new Date(b.issuedAt) - new Date(a.issuedAt);
        case "dateOldest":
          return new Date(a.issuedAt) - new Date(b.issuedAt);
        case "invoiceAZ":
          return a.invoiceNumber.localeCompare(b.invoiceNumber);
        case "invoiceZA":
          return b.invoiceNumber.localeCompare(a.invoiceNumber);
        case "clientAZ":
          return a.clientName.localeCompare(b.clientName);
        case "clientZA":
          return b.clientName.localeCompare(a.clientName);
        case "amountHighLow":
          return b.totalAmount - a.totalAmount;
        case "amountLowHigh":
          return a.totalAmount - b.totalAmount;
        default:
          return 0;
      }
    });

    setFilteredInvoices(sorted);
  };

  return (
    <div className="dropdown dropdown-bottom">
      <label tabIndex={0} className="btn btn-ghost">
        Sort
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content z-[60] menu p-2 shadow bg-base-200 rounded-box w-52"
      >
        <li>
          <button onClick={() => handleSortChange("dateNewest")}>
            Date (Newest First)
          </button>
        </li>
        <li>
          <button onClick={() => handleSortChange("dateOldest")}>
            Date (Oldest First)
          </button>
        </li>
        <li>
          <button onClick={() => handleSortChange("invoiceAZ")}>
            Invoice # A–Z
          </button>
        </li>
        <li>
          <button onClick={() => handleSortChange("invoiceZA")}>
            Invoice # Z–A
          </button>
        </li>
        <li>
          <button onClick={() => handleSortChange("clientAZ")}>
            Client Name A–Z
          </button>
        </li>
        <li>
          <button onClick={() => handleSortChange("clientZA")}>
            Client Name Z–A
          </button>
        </li>
        <li>
          <button onClick={() => handleSortChange("amountHighLow")}>
            Amount High → Low
          </button>
        </li>
        <li>
          <button onClick={() => handleSortChange("amountLowHigh")}>
            Amount Low → High
          </button>
        </li>
      </ul>
    </div>
  );
}

export default InvoiceSortDropdown;
