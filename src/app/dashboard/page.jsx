"use client";
import { useState, useEffect } from "react";
import LeftBar from "@/components/LeftBar";
import InvoiceTable from "@/components/InvoiceTable";
import { useInvoiceStore } from "@/store/useInvoice";
import { getInvoiceStats } from "@/lib/getInvoiceStats";
import Link from "next/link";
import DailyRevenueChart from "@/components/DailyRevenueChart";
import { Loading } from "@/components/Loading";
import { useCompanyStore } from "@/store/useCompany";

// This is a simple invoicing dashboard page using React and Tailwind CSS.

export default function InvoicingDashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [topClients, setTopClients] = useState([]);
  const [stats, setStats] = useState([]);
  const { invoiceData } = useInvoiceStore();
  const { company } = useCompanyStore();
  const currency = company?.currency;

  useEffect(() => {
    if (!invoiceData) return;
    setStats(getInvoiceStats(invoiceData, currency));
  }, [invoiceData]);

  useEffect(() => {
    const fetchTopClients = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/client/top`);

        if (!response.ok) {
          throw new Error("Failed to fetch top clients");
        }
        const data = await response.json();
        setTopClients(data.data);
      } catch (error) {
        console.error("Error fetching top clients:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopClients();
  }, []);

  // Function to get client initials
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

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

        <div className="flex w-full rounded-xl bg-base-100 shadow p-4 gap-4 mb-8">
          <InvoiceTable />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="card bg-base-100 shadow col-span-1 lg:col-span-2">
            <DailyRevenueChart />
          </div>

          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <h2 className="card-title">Top Clients</h2>
              {isLoading ? (
                <div className="flex justify-center py-4">
                  <span className="loading loading-spinner loading-md"></span>
                </div>
              ) : topClients.length > 0 ? (
                <ul className="mt-4 space-y-4">
                  {topClients.map((client) => (
                    <li
                      key={client._id}
                      className="flex justify-between items-center"
                    >
                      <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                          <div className="flex bg-base-200 rounded-full pt-2 text-center w-10 h-10">
                            <span className="self-center">
                              {getInitials(client.clientName)}
                            </span>
                          </div>
                        </div>
                        <span>{client.clientName}</span>
                      </div>
                      <span className="font-semibold">
                        {currency}
                        {client.totalBilled.toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center py-4 text-base-content/50">
                  No client data available
                </p>
              )}
              <div className="card-actions justify-end mt-4">
                <Link href="/clients">
                  <button className="btn btn-outline btn-sm">View All</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
