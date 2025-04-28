"use client";
import React from "react";
import LeftBar from "@/components/LeftBar";
import { InvoiceSuggest } from "@/components/InvoiceSuggest";

function InvoiceViewPage() {
  return (
    <div className="flex w-full h-screen">
      <LeftBar />
      <div className="flex flex-col w-full gap-4 bg-base-200 overflow-y-auto">
        <InvoiceSuggest />
      </div>
    </div>
  );
}

export default InvoiceViewPage;
