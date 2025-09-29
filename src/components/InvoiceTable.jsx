import React, { useEffect, useState } from "react";
import { useInvoiceStore } from "@/store/useInvoice";
import { Check, CheckSquare, Plus, Square, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCompanyStore } from "@/store/useCompany";
import InvoiceFilterDrawer from "./InvoiceFilter";
import { toast } from "sonner";
import InvoiceSortDropdown from "./InvoiceSort";
import ExportCSVButton from "./ExportCSVButton";

function InvoiceTable() {
  const { invoiceData, getInvoices } = useInvoiceStore();
  const { company } = useCompanyStore();
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [items, setItems] = useState([]);

  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [filters, setFilters] = useState({
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

  const [sortOption, setSortOption] = useState("");

  const router = useRouter();

  // for table pagination
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchData() {
      await getInvoices();
    }
    fetchData();
  }, [company]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredInvoices]);

  if (!invoiceData) {
    return <div className="p-4 text-center">Loading invoices...</div>;
  }

  const handleDelete = async () => {
    if (items.length === 0) {
      alert("Please select at least one invoice to delete.");
      return;
    }
    const confirmed = confirm(
      `Are you sure you want to delete ${items.length} invoice(s)?`
    );

    if (confirmed) {
      try {
        const response = await fetch("/api/invoice", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ids: items }),
        });

        if (response.ok) {
          toast.success("Invoices deleted successfully.");
          setItems([]);
          getInvoices();
        } else {
          alert("Failed to delete invoices.");
        }
      } catch (error) {
        console.error("Error deleting invoices:", error);
      }
    }
  };

  const handleStatusChange = async (status) => {
    if (items.length === 0) {
      alert("Please select at least one invoice.");
      return;
    }
    const confirmed = confirm(
      `Are you sure you want to mark ${items.length} invoice(s) as ${status}?`
    );

    if (confirmed) {
      try {
        const response = await fetch(`/api/invoice?status=${status}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ids: items }),
        });

        if (response.ok) {
          toast.success("Invoices marked as paid successfully.");
          setItems([]);
          getInvoices();
        } else {
          alert("Failed to mark invoices as paid.");
        }
      } catch (error) {
        console.error("Error marking invoices as paid:", error);
      }
    }
  };

  // Todo - figure this out
  const handleSort = (sortOption) => {
    // console.log("Sorting by:", sortOption);
    // Apply sorting logic here
  };

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const paginatedData = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Function to generate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="w-full overflow-x-auto">
      {/* Toolbar */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex gap-2">
          <InvoiceFilterDrawer
            filters={filters}
            setFilters={setFilters}
            invoiceData={invoiceData}
            setFilteredInvoices={setFilteredInvoices}
          />

          <InvoiceSortDropdown
            sortOption={sortOption}
            setSortOption={setSortOption}
            invoiceData={filteredInvoices}
            setFilteredInvoices={setFilteredInvoices}
          />

          {/* <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost">
              Sort By
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-48"
            >
              <li>
                <a onClick={() => handleSort("date_asc")}>Date ↑</a>
              </li>
              <li>
                <a onClick={() => handleSort("date_desc")}>Date ↓</a>
              </li>
              <li>
                <a onClick={() => handleSort("amount_asc")}>Amount ↑</a>
              </li>
              <li>
                <a onClick={() => handleSort("amount_desc")}>Amount ↓</a>
              </li>
              <li>
                <a onClick={() => handleSort("status_asc")}>Status A-Z</a>
              </li>
              <li>
                <a onClick={() => handleSort("status_desc")}>Status Z-A</a>
              </li>
            </ul>
          </div> */}
          <button className="btn btn-ghost" onClick={handleDelete}>
            Delete
          </button>
          <div className="dropdown dropdown-start">
            <label tabIndex={0} className="btn btn-ghost">
              Mark as
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 mt-2 shadow bg-base-200 rounded-box w-52"
            >
              {["Pending", "Paid", "Overdue", "Cancelled"].map((status) => (
                <li key={status}>
                  <a onClick={() => handleStatusChange(status)}>{status}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex gap-2">
          <ExportCSVButton invoices={filteredInvoices} items={items} />
        </div>
      </div>

      {/* Table */}
      <table className="table w-full">
        <thead className="italic uppercase">
          <tr>
            <th
              onClick={() => {
                setItems((prev) => {
                  if (prev.length === paginatedData.length) {
                    return [];
                  }
                  return paginatedData.map((invoice) => invoice._id);
                });
              }}
            >
              {items.length === paginatedData.length ? (
                <CheckSquare className="size-4" />
              ) : (
                <Square className="size-4" />
              )}
            </th>
            <th>Inv. No.</th>
            <th>Date</th>
            <th>Client Name</th>
            <th>Client Address</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody className="overflow-y-auto">
          {paginatedData.map((invoice, index) => (
            <tr
              key={index}
              className={`hover:bg-base-200/50 rounded-2xl h-24 ${
                items.includes(index) && "bg-base-100"
              } cursor-pointer`}
              onClick={(e) => {
                if (e.target.tagName !== "TH" && e.target.tagName !== "svg") {
                  router.push(`/invoices/${invoice._id}`);
                }
              }}
            >
              <th
                onClick={() => {
                  setItems((prev) => {
                    if (prev.includes(invoice._id)) {
                      return prev.filter((item) => item !== invoice._id);
                    }
                    return [...prev, invoice._id];
                  });
                }}
              >
                {items.includes(invoice._id) ? (
                  <CheckSquare className="size-4" />
                ) : (
                  <Square className="size-4" />
                )}
              </th>

              <td>{invoice.invoiceNumber}</td>
              <td>{invoice.issuedAt}</td>
              <td>{invoice.clientName}</td>
              <td>{invoice.clientAddress}</td>
              <td>{invoice.totalAmount.toFixed(2)}</td>
              <td>{invoice.status}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="7">
              <div className="flex justify-between gap-4 items-center p-2">
                <span className=" w-full">
                  {filteredInvoices.length == 0 ? (
                    "No invoices found."
                  ) : (
                    <span>
                      Showing {paginatedData.length} of {invoiceData.length}{" "}
                      invoices.
                    </span>
                  )}
                </span>
                <span className="">
                  Items per page:{" "}
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(e.target.value);
                    }}
                  >
                    <option value="1">1</option>
                    <option value="3">3</option>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                    <option value="25">25</option>
                  </select>
                </span>
                <div className="join">
                  {/* Prev button */}
                  <button
                    className="btn btn-sm"
                    disabled={currentPage === 1}
                    onClick={() => {
                      setCurrentPage((prev) => prev - 1);
                      setItems([]);
                    }}
                  >
                    «
                  </button>

                  {/* First page */}
                  {currentPage > 3 && (
                    <>
                      <button
                        className={`join-item btn btn-sm ${
                          currentPage === 1 ? "btn-primary" : ""
                        }`}
                        onClick={() => {
                          setCurrentPage(1);
                          setItems([]);
                        }}
                      >
                        1
                      </button>
                      {currentPage > 4 && (
                        <span className="join-item btn btn-sm">...</span>
                      )}
                    </>
                  )}

                  {/* Middle pages */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(
                      (number) =>
                        number >= currentPage - 2 && number <= currentPage + 2
                    )
                    .map((number) => (
                      <button
                        key={number}
                        className={`join-item btn btn-sm ${
                          currentPage === number ? "btn-primary" : ""
                        }`}
                        onClick={() => {
                          setCurrentPage(number);
                          setItems([]);
                        }}
                      >
                        {number}
                      </button>
                    ))}

                  {/* Last page */}
                  {currentPage < totalPages - 2 && (
                    <>
                      {currentPage < totalPages - 3 && (
                        <span className="join-item btn btn-sm">...</span>
                      )}
                      <button
                        className={`join-item btn btn-sm ${
                          currentPage === totalPages ? "btn-primary" : ""
                        }`}
                        onClick={() => {
                          setCurrentPage(totalPages);
                          setItems([]);
                        }}
                      >
                        {totalPages}
                      </button>
                    </>
                  )}

                  {/* Next button */}
                  <button
                    className="join-item btn btn-sm"
                    disabled={currentPage === totalPages}
                    onClick={() => {
                      setCurrentPage((prev) => prev + 1);
                      setItems([]);
                    }}
                  >
                    »
                  </button>
                </div>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default InvoiceTable;
