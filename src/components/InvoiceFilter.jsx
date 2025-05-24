import React, { useState, useEffect } from "react";

function InvoiceFilterDrawer({
  filters,
  setFilters,
  invoiceData,
  setFilteredInvoices,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const resetFilters = () => {
    setFilters({
      status: "",
      dateFrom: "",
      dateTo: "",
      keyword: "",
      clientName: "",
      invoiceNumber: "",
      minAmount: "",
      maxAmount: "",
      changesSuggested: false,
    });
    applyFilters();
  };

  function filterInvoices(invoiceData, filters) {
    if (!invoiceData) return [];
    return invoiceData.filter((invoice) => {
      // 1. Filter by status
      if (
        filters.status &&
        invoice.status.toLowerCase() !== filters.status.toLowerCase()
      ) {
        return false;
      }

      // 2. Filter by date range (issuedAt)
      const issuedDate = new Date(invoice.issuedAt);
      if (filters.dateFrom && new Date(filters.dateFrom) > issuedDate) {
        return false;
      }
      if (filters.dateTo && new Date(filters.dateTo) < issuedDate) {
        return false;
      }

      // 3. Filter by keyword (in invoiceNumber, clientName, or businessName)
      const keyword = filters.keyword?.toLowerCase();
      if (keyword) {
        const searchable =
          `${invoice.invoiceNumber} ${invoice.clientName} ${invoice.businessName}`.toLowerCase();
        if (!searchable.includes(keyword)) {
          return false;
        }
      }

      return true;
    });
  }

  useEffect(() => {
    const filtered = filterInvoices(invoiceData, filters);
    setFilteredInvoices(filtered);
  }, [filters, invoiceData]);

  const applyFilters = () => {
    const filtered = filterInvoices(invoiceData, filters);
    setFilteredInvoices(filtered);
    setIsOpen(false); // Close drawer
  };

  return (
    <>
      {/* Trigger Button */}
      <button className="btn btn-ghost" onClick={() => setIsOpen(true)}>
        Filter
      </button>

      {/* Drawer Background Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Drawer Content */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-base-200 shadow-lg z-50 p-5 transform transition-transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div>
          <h3 className="font-bold mb-2">Status</h3>
          <select
            className="select w-full"
            value={filters.status}
            onChange={(e) => handleChange("status", e.target.value)}
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <h3 className="font-bold mb-2">Date Range</h3>
          <input
            type="date"
            className="input input-bordered w-full mb-2"
            value={filters.dateFrom}
            onChange={(e) => handleChange("dateFrom", e.target.value)}
          />
          <input
            type="date"
            className="input input-bordered w-full"
            value={filters.dateTo}
            onChange={(e) => handleChange("dateTo", e.target.value)}
          />
        </div>

        <div>
          <h3 className="font-bold mb-2">Client Name</h3>
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Search by client"
            value={filters.clientName}
            onChange={(e) => handleChange("clientName", e.target.value)}
          />
        </div>

        <div>
          <h3 className="font-bold mb-2">Invoice Number</h3>
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="INV/1001/2025"
            value={filters.invoiceNumber}
            onChange={(e) => handleChange("invoiceNumber", e.target.value)}
          />
        </div>

        <div>
          <h3 className="font-bold mb-2">Amount Range</h3>
          <div className="flex gap-2">
            <input
              type="number"
              className="input input-bordered w-1/2"
              placeholder="Min"
              value={filters.minAmount}
              onChange={(e) => handleChange("minAmount", e.target.value)}
            />
            <input
              type="number"
              className="input input-bordered w-1/2"
              placeholder="Max"
              value={filters.maxAmount}
              onChange={(e) => handleChange("maxAmount", e.target.value)}
            />
          </div>
        </div>

        <div>
          <h3 className="font-bold mb-2">Changes Suggested</h3>
          <select
            className="select w-full"
            value={filters.changesSuggested}
            onChange={(e) => handleChange("changesSuggested", e.target.value)}
          >
            <option value="">All</option>
            <option value={true}>Yes</option>
            <option value={false}>No</option>
          </select>
        </div>

        <div>
          <h3 className="font-bold mb-2">Keyword</h3>
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Search keyword"
            value={filters.keyword}
            onChange={(e) => handleChange("keyword", e.target.value)}
          />
        </div>

        <div className="flex justify-between pt-2">
          <button className="btn btn-sm btn-outline" onClick={resetFilters}>
            Clear
          </button>
          <button className="btn btn-sm btn-primary" onClick={applyFilters}>
            Apply
          </button>
        </div>
      </div>
    </>
  );
}

export default InvoiceFilterDrawer;
