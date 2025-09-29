"use client";
import React from "react";
import LeftBar from "@/components/LeftBar";
import InvoiceTable from "@/components/InvoiceTable";

function Invoices() {
  return (
    <div className="vibe-dashboard">
      <LeftBar />
      <div className="flex flex-col w-full gap-4 overflow-y-auto rounded-xl">
        <div className="">
          <h1 className="gradient-text text-3xl font-bold">Invoices</h1>
          <p className="mt-2">Manage all your invoices here.</p>
        </div>
        <div className="flex w-full rounded-xl vibe-opacity shadow p-4 gap-4">
          <InvoiceTable />
        </div>
      </div>
    </div>
  );
}

export default Invoices;
