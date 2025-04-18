"use client";
import React from "react";
import LeftBar from "../../components/LeftBar";

function Invoices() {
  return (
    <div className="flex flex-row h-screen">
      <LeftBar />
      <div className="flex-grow p-4">
        <h1 className="text-2xl font-bold">Invoices</h1>
        <p className="mt-2">Manage your invoices here.</p>
        {/* Add your invoice management components here */}
      </div>
    </div>
  );
}

export default Invoices;
