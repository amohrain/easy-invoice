import React, { useEffect, useState } from "react";
import { useInvoiceStore } from "@/store/useInvoice";
import { Check, CheckSquare, Plus, Square, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import InvoiceFilter from "./InvoiceFilter";
import InvoiceSort from "./InvoiceSort";
import { useCompanyStore } from "@/store/useCompany";

function InvoiceTable() {
  const { invoiceData, getInvoices } = useInvoiceStore();
  const { company } = useCompanyStore();
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({
    status: "",
    dateFrom: "",
    dateTo: "",
    keyword: "",
  });

  const router = useRouter();

  const ITEMS_PER_PAGE = 10;

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
  }, [invoiceData]);

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
          alert("Invoices deleted successfully.");
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
          alert("Invoices marked as paid successfully.");
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

  const handleSort = (sortOption) => {
    console.log("Sorting by:", sortOption);
    // Apply sorting logic here
  };

  const totalPages = Math.ceil(invoiceData.length / ITEMS_PER_PAGE);
  const paginatedData = invoiceData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="w-full overflow-x-auto">
      {/* Toolbar */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex gap-2">
          <InvoiceFilter filters={filters} setFilters={setFilters} />
          <div className="dropdown">
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
          </div>
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
          <Link href="/invoices/create">
            <button className="btn btn-primary">
              <Plus /> Add
            </button>
          </Link>
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
        <tbody>
          {paginatedData.map((invoice, index) => (
            <tr
              key={index}
              className={`hover:bg-base-200 ${
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
              <div className="flex justify-between items-center p-2">
                <span className="text-center w-full">
                  {invoiceData.length == 0
                    ? "No invoices found. Click add to create one"
                    : `Page ${currentPage} of ${totalPages}`}
                </span>
                <div className="flex gap-2">
                  <button
                    className="btn btn-xs"
                    disabled={currentPage === 1}
                    onClick={() => {
                      setCurrentPage((prev) => prev - 1);
                      setItems([]);
                    }}
                  >
                    Previous
                  </button>
                  <button
                    className="btn btn-xs"
                    disabled={currentPage === totalPages}
                    onClick={() => {
                      setCurrentPage((prev) => prev + 1);
                      setItems([]);
                    }}
                  >
                    Next
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
