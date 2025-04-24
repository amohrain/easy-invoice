"use client";
import { useEffect, useState } from "react";
import {
  ChevronDown,
  Download,
  Edit,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { Loading } from "@/components/Loading";
import LeftBar from "@/components/LeftBar";
import { useInvoiceStore } from "@/store/useInvoice";

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const { invoiceData, getInvoices } = useInvoiceStore();

  useEffect(
    () => {
      async function fetchData() {
        await getInvoices();
        const response = await fetch("/api/client");
        const data = await response.json();
        setClients(data.data);
      }
      fetchData();
    },
    [
      // Todo to decide
    ]
  );

  // Form state for adding/editing clients
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    clientAddress: "",
    status: "active",
  });

  const resetForm = () => {
    setFormData({
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      clientAddress: "",
      status: "active",
    });
    setSelectedClient(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (client) => {
    setSelectedClient(client);
    setFormData({
      clientName: client.clientName,
      clientEmail: client.clientEmail,
      clientPhone: client.clientPhone,
      clientAddress: client.clientAddress,
      status: client.clientAddress,
    });
    setIsModalOpen(true);
  };

  // Todo- Open modal to delete
  const openDeleteModal = (client) => {
    setClientToDelete(client);
    setIsDeleteModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log("form:", formData);
    const {
      clientName,
      clientAddress,
      clientEmail,
      clientPhone,
      clientTaxId,
      status,
    } = formData;

    const response = await fetch(
      `/api/client${selectedClient ? "/" + selectedClient._id : ""}`,
      {
        method: selectedClient ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName,
          clientAddress,
          clientEmail,
          clientPhone,
          clientTaxId,
          status,
        }),
      }
    );
    setLoading(false);
    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = async () => {
    setLoading(true);
    if (clientToDelete) {
      const response = await fetch(`/api/client/${clientToDelete._id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("Deleted");
      } else {
        console.log("Error deleting client");
      }

      setIsDeleteModalOpen(false);
      setClientToDelete(null);
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const calculateTotalBilled = (client) => {
    const totalBilled = invoiceData
      .filter((invoice) => invoice.clientId === client._id)
      .reduce((total, invoice) => total + invoice.totalAmount, 0);
    return totalBilled;
  };

  const calculateLastBilled = (client) => {
    const lastBilled = invoiceData
      .filter((invoice) => invoice.clientId === client._id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(
        (invoice) => new Date(invoice.createdAt).toISOString().split("T")[0]
      )[0];

    return lastBilled;
  };

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.clientAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.clientEmail.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || client.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const indexOfLastClient = currentPage * itemsPerPage;
  const indexOfFirstClient = indexOfLastClient - itemsPerPage;
  const currentClients = filteredClients.slice(
    indexOfFirstClient,
    indexOfLastClient
  );
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);

  // Function to change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Function to generate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  if (loading) return <Loading />;

  return (
    <div className="flex flex-row h-screen bg-base-200">
      <LeftBar />
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 mt-6">
          <h1 className="text-2xl font-bold">Clients</h1>
          <button
            className="btn btn-primary mt-4 md:mt-0"
            onClick={openAddModal}
          >
            <Plus size={18} />
            Add New Client
          </button>
        </div>

        <div className="bg-base-100 rounded-lg shadow p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search clients..."
                  className="input input-bordered w-full pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-3 w-5 h-5 text-base-content/50" />
              </div>
              <div className="dropdown">
                <label tabIndex={0} className="btn">
                  <Filter size={18} />
                  Status
                  <ChevronDown size={16} />
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content z-10 menu p-2 shadow bg-base-100 rounded-box w-52"
                >
                  <li>
                    <a
                      onClick={() => setFilterStatus("all")}
                      className={filterStatus === "all" ? "active" : ""}
                    >
                      All
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() => setFilterStatus("active")}
                      className={filterStatus === "active" ? "active" : ""}
                    >
                      Active
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() => setFilterStatus("inactive")}
                      className={filterStatus === "inactive" ? "active" : ""}
                    >
                      Inactive
                    </a>
                  </li>
                </ul>
              </div>
              <button className="btn">
                <Download size={18} />
                Export
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th className="pl-17">Client</th>
                  <th>Email</th>
                  <th>Total Billed</th>
                  <th>Last Invoice</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentClients.map((client) => (
                  <tr key={client._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                          <div className="py-1.5 bg-base-200 text-center rounded-full w-10 h-10 flex items-center justify-center leading-none">
                            <span className="font-bold text-lg">
                              {getInitials(client.clientName)}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{client.clientName}</div>
                          <div className="text-sm opacity-50">
                            {client.clientAddress}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{client.clientEmail}</td>
                    <td>{calculateTotalBilled(client)}</td>
                    <td>{calculateLastBilled(client)}</td>
                    <td>
                      <div
                        className={`badge ${
                          client.status === "active"
                            ? "badge-success"
                            : "badge-ghost"
                        }`}
                      >
                        {client.status?.charAt(0).toUpperCase() +
                          client.status?.slice(1)}
                      </div>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          className="btn btn-ghost btn-xs"
                          onClick={() => openEditModal(client)}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="btn btn-ghost btn-xs text-error"
                          onClick={() => openDeleteModal(client)}
                        >
                          <Trash2 size={16} />
                        </button>

                        {/* Todo Client Actions */}
                        {/* <div className="dropdown dropdown-end">
                          <label tabIndex={0} className="btn btn-ghost btn-xs">
                            <MoreHorizontal size={16} />
                          </label>
                          <ul
                            tabIndex={0}
                            className="dropdown-content z-10 menu p-2 shadow bg-base-100 rounded-box w-40"
                          >
                            <li>
                              <a>View Details</a>
                            </li>
                            <li>
                              <a>New Invoice</a>
                            </li>
                            <li>
                              <a>Payment History</a>
                            </li>
                          </ul>
                        </div> */}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {currentClients.length === 0 && (
              <div className="text-center py-10">
                <p className="text-base-content/50">
                  No clients found. Try adjusting your search.
                </p>
              </div>
            )}

            {/* <div className="flex justify-between items-center mt-6">
              <span className="text-sm text-base-content/70">
                Showing {filteredClients.length} of {clients.length} clients
              </span>
              <div className="join">
                <button className="join-item btn btn-sm">«</button>
                <button className="join-item btn btn-sm btn-active">1</button>
                <button className="join-item btn btn-sm">2</button>
                <button className="join-item btn btn-sm">»</button>
              </div>
            </div> */}

            <div className="flex justify-between items-center mt-6">
              <span className="text-sm text-base-content/70">
                Showing {indexOfFirstClient + 1}-
                {Math.min(indexOfLastClient, filteredClients.length)} of{" "}
                {filteredClients.length} clients
              </span>
              <div className="join">
                <button
                  className="join-item btn btn-sm btn-ghost"
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  «
                </button>

                {pageNumbers.map((number) => (
                  <button
                    key={number}
                    className={`join-item btn btn-sm ${
                      currentPage === number ? "btn-disabled" : ""
                    }`}
                    onClick={() => paginate(number)}
                  >
                    {number}
                  </button>
                ))}

                <button
                  className="join-item btn btn-sm btn-ghost"
                  onClick={() =>
                    paginate(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  »
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Client Modal */}
      {isModalOpen && (
        <div className="modal modal-open inset-0 flex items-center justify-center z-50 p-4">
          <div className="modal-box max-w-2xl w-full">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => setIsModalOpen(false)}
            >
              <X size={18} />
            </button>
            <h3 className="font-bold text-lg mb-6">
              {selectedClient ? "Edit Client" : "Add New Client"}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Client Name</span>
                  </label>
                  <input
                    type="text"
                    name="clientName"
                    placeholder="Enter company name"
                    className="input input-bordered"
                    value={formData.clientName}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="email"
                    name="clientEmail"
                    placeholder="Enter email address"
                    className="input input-bordered"
                    value={formData.clientEmail}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Phone</span>
                  </label>
                  <input
                    type="text"
                    name="clientPhone"
                    placeholder="Enter phone number"
                    className="input input-bordered"
                    value={formData.clientPhone}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Status</span>
                  </label>
                  <select
                    name="status"
                    className="select select-bordered"
                    value={formData.status}
                    onChange={handleFormChange}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Address</span>
                  </label>
                  <textarea
                    type="text"
                    name="clientAddress"
                    placeholder="Enter full address"
                    className="input input-bordered h-24 resize-none pt-2"
                    value={formData.clientAddress}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>

              <div className="modal-action">
                <button
                  type="button"
                  className="btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {selectedClient ? "Update Client" : "Add Client"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="modal modal-open inset-0 flex items-center justify-center z-50 p-4">
          <div className="modal-box max-w-2xl w-full">
            <h3 className="font-bold text-lg">Confirm Delete</h3>
            <p className="py-4">
              Are you sure you want to delete client "
              {clientToDelete?.clientName}"? This action cannot be undone.
            </p>
            <div className="modal-action">
              <button
                className="btn"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button className="btn btn-error" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
