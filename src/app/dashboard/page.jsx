"use client";
import { useState } from "react";
import {
  Calendar,
  CreditCard,
  Download,
  Filter,
  Plus,
  Search,
  Settings,
  TrendingUp,
  Users,
} from "lucide-react";
import LeftBar from "../../components/LeftBar";

// This is a simple invoicing dashboard page using React and Tailwind CSS.

export default function InvoicingDashboard() {
  const [selectedTab, setSelectedTab] = useState("all");

  const invoices = [
    {
      id: "#INV-001",
      client: "Tech Solutions Inc.",
      amount: 2450.75,
      date: "2025-04-15",
      status: "paid",
    },
    {
      id: "#INV-002",
      client: "Global Marketing Group",
      amount: 1890.0,
      date: "2025-04-18",
      status: "pending",
    },
    {
      id: "#INV-003",
      client: "Creative Studios LLC",
      amount: 3200.5,
      date: "2025-04-10",
      status: "overdue",
    },
    {
      id: "#INV-004",
      client: "Nexus Innovations",
      amount: 4750.25,
      date: "2025-04-20",
      status: "draft",
    },
  ];

  const stats = [
    {
      title: "Total Revenue",
      value: "$12,290.50",
      icon: <TrendingUp className="w-6 h-6" />,
      change: "+8.2%",
      changeType: "positive",
    },
    {
      title: "Pending",
      value: "$1,890.00",
      icon: <CreditCard className="w-6 h-6" />,
      change: "-2.5%",
      changeType: "negative",
    },
    {
      title: "Overdue",
      value: "$3,200.50",
      icon: <Calendar className="w-6 h-6" />,
      change: "+5.1%",
      changeType: "positive",
    },
    {
      title: "Clients",
      value: "24",
      icon: <Users className="w-6 h-6" />,
      change: "+3",
      changeType: "positive",
    },
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case "paid":
        return "badge-success";
      case "pending":
        return "badge-warning";
      case "overdue":
        return "badge-error";
      case "draft":
        return "badge-ghost";
      default:
        return "badge-info";
    }
  };

  const filteredInvoices =
    selectedTab === "all"
      ? invoices
      : invoices.filter((invoice) => invoice.status === selectedTab);

  return (
    <div className="flex flex-row h-screen bg-base-200">
      <LeftBar />
      <div className="container overflow-y-auto mx-auto p-4">
        <h1 className="text-2xl font-bold my-6">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="card bg-base-100 shadow">
              <div className="card-body p-5">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="card-title text-base font-medium text-base-content/70">
                      {stat.title}
                    </h2>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`rounded-full p-3 bg-base-200`}>
                    {stat.icon}
                  </div>
                </div>
                <div className="mt-2">
                  <span
                    className={`text-sm ${
                      stat.changeType === "positive"
                        ? "text-success"
                        : "text-error"
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-sm text-base-content/70">
                    {" "}
                    this month
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-base-100 rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h2 className="text-xl font-bold mb-4 md:mb-0">Recent Invoices</h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="join">
                <div className="join-item">
                  <button
                    className={`btn ${
                      selectedTab === "all" ? "btn-primary" : "btn-ghost"
                    }`}
                    onClick={() => setSelectedTab("all")}
                  >
                    All
                  </button>
                </div>
                <div className="join-item">
                  <button
                    className={`btn ${
                      selectedTab === "paid" ? "btn-primary" : "btn-ghost"
                    }`}
                    onClick={() => setSelectedTab("paid")}
                  >
                    Paid
                  </button>
                </div>
                <div className="join-item">
                  <button
                    className={`btn ${
                      selectedTab === "pending" ? "btn-primary" : "btn-ghost"
                    }`}
                    onClick={() => setSelectedTab("pending")}
                  >
                    Pending
                  </button>
                </div>
                <div className="join-item">
                  <button
                    className={`btn ${
                      selectedTab === "overdue" ? "btn-primary" : "btn-ghost"
                    }`}
                    onClick={() => setSelectedTab("overdue")}
                  >
                    Overdue
                  </button>
                </div>
              </div>
              <button className="btn btn-primary">
                <Plus size={18} />
                New Invoice
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search invoices..."
                    className="input input-bordered w-full max-w-xs pl-10"
                  />
                  <Search className="absolute left-3 top-3 w-5 h-5 text-base-content/50" />
                </div>
                <button className="btn btn-ghost ml-2">
                  <Filter size={18} />
                  Filter
                </button>
              </div>
              <div className="flex gap-2">
                <button className="btn btn-ghost">
                  <Download size={18} />
                  Export
                </button>
                <button className="btn btn-ghost">
                  <Settings size={18} />
                </button>
              </div>
            </div>

            <table className="table w-full">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Client</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td>{invoice.id}</td>
                    <td>{invoice.client}</td>
                    <td>${invoice.amount.toFixed(2)}</td>
                    <td>{new Date(invoice.date).toLocaleDateString()}</td>
                    <td>
                      <div
                        className={`badge ${getStatusClass(invoice.status)}`}
                      >
                        {invoice.status.charAt(0).toUpperCase() +
                          invoice.status.slice(1)}
                      </div>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button className="btn btn-ghost btn-xs">View</button>
                        <button className="btn btn-ghost btn-xs">Edit</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between items-center mt-6">
              <span className="text-sm text-base-content/70">
                Showing {filteredInvoices.length} of {filteredInvoices.length}{" "}
                entries
              </span>
              <div className="join">
                <button className="join-item btn btn-sm">«</button>
                <button className="join-item btn btn-sm btn-active">1</button>
                <button className="join-item btn btn-sm">2</button>
                <button className="join-item btn btn-sm">3</button>
                <button className="join-item btn btn-sm">»</button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="card bg-base-100 shadow col-span-1 lg:col-span-2">
            <div className="card-body">
              <h2 className="card-title">Revenue Overview</h2>
              <div className="h-64 flex items-center justify-center">
                <p className="text-base-content/50">
                  Chart placeholder - would use recharts in a real
                  implementation
                </p>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <h2 className="card-title">Top Clients</h2>
              <ul className="mt-4 space-y-4">
                <li className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="avatar placeholder">
                      <div className="bg-neutral-focus text-neutral-content rounded-full w-8">
                        <span>TS</span>
                      </div>
                    </div>
                    <span>Tech Solutions Inc.</span>
                  </div>
                  <span className="font-semibold">$2,450.75</span>
                </li>
                <li className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="avatar placeholder">
                      <div className="bg-neutral-focus text-neutral-content rounded-full w-8">
                        <span>GM</span>
                      </div>
                    </div>
                    <span>Global Marketing Group</span>
                  </div>
                  <span className="font-semibold">$1,890.00</span>
                </li>
                <li className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="avatar placeholder">
                      <div className="bg-neutral-focus text-neutral-content rounded-full w-8">
                        <span>CS</span>
                      </div>
                    </div>
                    <span>Creative Studios LLC</span>
                  </div>
                  <span className="font-semibold">$3,200.50</span>
                </li>
              </ul>
              <div className="card-actions justify-end mt-4">
                <button className="btn btn-outline btn-sm">View All</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
