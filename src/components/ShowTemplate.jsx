"use client";
import { set } from "mongoose";
import React from "react";
import Template from "@/models/template.model";

function ShowTemplate({ template, setTemplate, currentTemplate }) {
  const id = currentTemplate.id;

  // Dummy invoice data
  const sampleInvoice = {
    businessName: "ABC Solutions",
    businessAddress: "123 Business St, NY",
    clientName: "John Doe",
    invoiceNumber: "INV-1001",
    issuedAt: "2025-03-20",
    items: [
      {
        description: "Web Development",
        quantity: 1,
        unitPrice: 2000,
        discount: 0,
        total: 2000,
      },
      {
        description: "Hosting",
        quantity: 3,
        unitPrice: 50,
        discount: 0,
        total: 150,
      },
    ],
    totalAmount: 2150,
  };

  // Function to get Tailwind alignment classes
  const getAlignmentClass = (alignment) => {
    switch (alignment) {
      case "left":
        return "text-left";
      case "right":
        return "text-right";
      case "center":
        return "text-center";
      default:
        return "";
    }
  };

  return (
    <div
      onClick={() => setTemplate(id)}
      className={`card flex flex-col w-fit p-4 cursor-pointer ${
        template === id ? "border border-primary-500" : "border border-base-300"
      }`}
    >
      <h2 className="text-lg font-bold">{currentTemplate.name}</h2>
      <p className="text-sm">{currentTemplate.description}</p>

      {/* Mini Invoice Preview */}
      <div className="mt-2 border-t border-gray-300 pt-2 text-xs text-gray-600 space-y-1">
        {currentTemplate.structure.map((section) => (
          <div
            key={section.section}
            className={`flex flex-col ${getAlignmentClass(section.alignment)}`}
          >
            {section.section === "header" && (
              <div className="font-semibold">{sampleInvoice.businessName}</div>
            )}
            {section.section === "clientDetails" && (
              <div>{sampleInvoice.clientName}</div>
            )}
            {section.section === "invoiceDetails" && (
              <div>
                Invoice: {sampleInvoice.invoiceNumber} |{" "}
                {sampleInvoice.issuedAt}
              </div>
            )}
            {section.section === "items" && (
              <div>
                {sampleInvoice.items.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{item.description}</span>
                    <span>${item.total}</span>
                  </div>
                ))}
              </div>
            )}
            {section.section === "totals" && (
              <div className="font-semibold">
                Total: ${sampleInvoice.totalAmount}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ShowTemplate;
