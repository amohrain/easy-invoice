"use client";
import React from "react";
import LeftBar from "../../components/LeftBar";
import InvoiceTable from "../../components/InvoiceTable";

function Invoices() {
  return (
    <div className="flex w-full h-screen">
      <LeftBar />
      <div className="flex flex-col w-full p-4 gap-4">
        <div className="">
          <h1 className="text-2xl font-bold">Invoices</h1>
          <p className="mt-2">Manage your invoices here.</p>
        </div>
        <div className="flex w-full h-full rounded-xl bg-base-300 p-4 gap-4">
          {/* Tabs here */}
          <InvoiceTable />

          {/* The whole table here */}

          {/* Pagination buttons */}
        </div>
      </div>
    </div>
  );
}

export default Invoices;
