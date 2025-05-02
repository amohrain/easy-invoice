"use client";
import React, { useEffect, useState } from "react";
import LeftBar from "../../components/LeftBar";
import { Loading } from "../../components/Loading";
import { useInvoiceStore } from "../../store/useInvoice";
import { ExternalLink, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

function Suggestions() {
  const { suggestions, fetchSuggestions, deleteSuggestion } = useInvoiceStore();
  const [items, setItems] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      await fetchSuggestions();
    }
    fetchData();
  }, []);

  // Status badges with different colors
  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return <span className="badge badge-warning">{status}</span>;
      case "Approved":
        return <span className="badge badge-success">{status}</span>;
      case "Rejected":
        return <span className="badge badge-error">{status}</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  const handleDelete = async (id) => {
    await deleteSuggestion(id);
  };

  if (!suggestions) return <Loading />;

  return (
    <div className="flex flex-row h-screen bg-base-200">
      <LeftBar />
      <div className="container overflow-y-auto mx-auto p-4">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Sugggestions</h1>
          <p className="mt-2">
            This is the suggestions page. Here you can manage client
            suggestions.
          </p>
        </div>
        <div className="flex w-full rounded-xl bg-base-100 shadow p-4 gap-4 overflow-x-auto">
          <table className="table w-full">
            <thead className="italic uppercase">
              <tr>
                <th>#</th>
                <th>Client Name</th>
                <th>Client Email</th>
                <th>Client Address</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {suggestions.map((suggestion, index) => (
                <tr key={suggestion._id}>
                  <th className="italic">{index + 1}</th>
                  <th>{suggestion.clientName}</th>
                  <th>{suggestion.clientEmail}</th>
                  <th>{suggestion.clientAddress}</th>
                  <td>{getStatusBadge(suggestion.status)}</td>
                  <th>
                    <div className="flex flex-row gap-4">
                      <Trash2
                        onClick={() => handleDelete(suggestion._id)}
                        className="size-4 cursor-pointer text-red-500"
                      />
                      <ExternalLink
                        onClick={() => {
                          router.push(`/invoices/${suggestion.invoice}`);
                        }}
                        className="size-4 cursor-pointer"
                      />
                    </div>
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Suggestions;
