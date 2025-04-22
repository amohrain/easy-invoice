import React from "react";

function InvoiceFilter({ filters, setFilters }) {
  const handleStatusFilter = (status) => {
    setFilters((prev) => ({ ...prev, status }));
  };

  const handleDateFilter = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field === "from" ? "dateFrom" : "dateTo"]: value,
    }));
  };

  const handleKeywordFilter = (keyword) => {
    setFilters((prev) => ({ ...prev, keyword }));
  };

  const resetFilters = () => {
    setFilters({ status: "", dateFrom: "", dateTo: "", keyword: "" });
  };

  const applyFilters = () => {
    console.log("Applying Filters:", filters);
    // send to API or filter local data
  };
  return (
    <div className="dropdown dropdown-start">
      <label tabIndex={0} className="btn btn-ghost btn-sm">
        Filter
      </label>
      <div
        tabIndex={0}
        className="dropdown-content text-sm z-[1] card card-compact w-72 p-4 shadow bg-base-200 rounded-box space-y-3"
      >
        <div>
          <h3 className="font-bold mb-2">Status</h3>
          <select
            className="select w-full"
            value={filters.status}
            onChange={(e) => handleStatusFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <h3 className="font-bold mb-2">Date Range</h3>
          <input
            type="date"
            className="input input-bordered w-full mb-2"
            onChange={(e) => handleDateFilter("from", e.target.value)}
          />
          <input
            type="date"
            className="input input-bordered w-full"
            onChange={(e) => handleDateFilter("to", e.target.value)}
          />
        </div>
        <div>
          <h3 className="font-bold mb-2">Keyword</h3>
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Search by keyword"
            onChange={(e) => handleKeywordFilter(e.target.value)}
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
    </div>
  );
}

export default InvoiceFilter;
