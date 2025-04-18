"use client";
import { set } from "mongoose";
import React from "react";
import Template from "@/models/template.model";
import { MiniInvoice } from "./MiniInvoice";

function ShowTemplate({
  template,
  templatesData,
  setTemplate,
  currentTemplate,
}) {
  const id = currentTemplate.id;

  // Dummy invoice data
  const sampleInvoice = {
    businessName: "ABC Limited",
    businessAddress: "123 Business St, NY",
    clientName: "John Doe",
    invoiceNumber: "INV-1001",
    issuedAt: "2025-03-20",
    items: [
      {
        description: "Web Development",
        quantity: 1,
        rate: 2000,
        discount: 0,
        total: 2000,
      },
      {
        description: "Hosting",
        quantity: 3,
        rate: 50,
        discount: 0,
        total: 150,
      },
    ],
    deductions: [
      {
        description: "Discounts:",
        amount: 100,
      },
    ],
    additions: [
      {
        description: "CGST @ 9%:",
        amount: 100,
      },
      {
        description: "SGST @ 9%:",
        amount: 100,
      },
    ],
    subTotal: null,
    totalAmount: 2150,
  };

  return (
    <div className="flex flex-col w-2/3 gap-3">
      <div
        onClick={() => setTemplate(templatesData.find((t) => t.id === id))}
        className={`card flex flex-col w-full p-4 cursor-pointer ${
          template === id ? "border border-accent" : "border border-base-300"
        }`}
      >
        {/* Mini Invoice Preview */}
        {/* <MiniInvoice
          currentTemplate={currentTemplate}
          sampleInvoice={sampleInvoice}
        /> */}
      </div>
      <h2
        className={`text-xs font-bold text-center ${
          template === id ? "text-accent" : ""
        }`}
      >
        {currentTemplate.name}
      </h2>
    </div>
  );
}

export default ShowTemplate;
