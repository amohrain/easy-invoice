"use client";
import React, { useState, useEffect } from "react";
import InvoiceEditor from "../../components/test/InvoiceEditor";
import LeftBar from "@/components/LeftBar";
import {
  generateAndDownloadInvoicePDF,
  previewInvoicePDF,
} from "../../components/test/InvoicePDFMake.js";

const InvoiceApp = () => {
  const [invoices, setInvoices] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [currentInvoice, setCurrentInvoice] = useState(null);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // In a real application, you would fetch these from your API
    // This is just for demonstration

    // Example template (from your provided data)
    const exampleTemplate = {
      labels: {
        businessName: "Company: ",
        businessAddress: "Address: ",
        businessEmail: "Email: ",
        businessPhone: "Phone: ",
        businessLogo: "",
        clientName: "Bill to: ",
        clientEmail: "Email: ",
        clientPhone: "Phone: ",
        clientAddress: "Address: ",
        clientTaxId: "",
        invoiceNumber: "Inv. No.: ",
        issuedAt: "Issue Date: ",
        dueDate: "Due Date: ",
        paymentTerms: "Payment terms: ",
        subtotal: "Sub total",
        tax: "Add tax: ",
        discount: "Less: discount: ",
        totalAmount: "Total: ",
        notes: "Notes: ",
        paymentInstructions: "Payment instructions: ",
      },
      id: "19",
      name: "Standard Business Invoice",
      fontSize: 14,
      structure: [
        {
          style: {
            alignment: "right",
            bold: true,
            uppercase: true,
            fontSize: 16,
          },
          section: "header",
          fields: [],
          columns: [
            {
              fields: ["businessLogo"],
              style: {
                alignment: "left",
              },
            },
            {
              fields: [
                "businessName",
                "businessAddress",
                "businessEmail",
                "businessPhone",
              ],
              style: {
                alignment: "right",
              },
            },
          ],
          items: [],
        },
        {
          section: "horizontal-line",
          fields: [],
          items: [],
        },
        {
          style: {
            alignment: "left",
          },
          section: "clientDetails",
          title: "Bill to",
          fields: [
            "clientName",
            "clientAddress",
            "clientPhone",
            "clientEmail",
            "clientTaxId",
          ],
          items: [],
        },
        {
          section: "invoiceDetails",
          fields: [],
          columns: [
            {
              style: {
                alignment: "left",
              },
              fields: ["invoiceNumber", "issuedAt"],
            },
            {
              style: {
                alignment: "right",
              },
              fields: ["dueDate", "paymentTerms"],
            },
          ],
          items: [],
        },
        {
          section: "space",
          fields: [],
          items: [],
        },
        {
          style: {
            alignment: "left",
          },
          section: "items",
          fields: [],
          items: ["description", "quantity", "rate", "total"],
        },
        {
          section: "break",
          fields: [],
          items: [],
        },
        {
          style: {
            alignment: "right",
            bold: true,
          },
          section: "totals",
          fields: [],
          items: [],
        },
        {
          style: {
            alignment: "left",
          },
          section: "footer",
          fields: ["notes", "paymentInstructions"],
          items: [],
        },
      ],
    };

    // Example invoice (from your provided data)
    const exampleInvoice = {
      invoiceId: 1001,
      invoiceNumber: "INV/1001/2025",
      businessName: "My New Company",
      businessAddress: "A-144, Kusumpur Pahari",
      businessEmail: "abhishek181920@gmail.com",
      businessPhone: "8826172218",
      businessLogo:
        "https://res.cloudinary.com/dfipkfhm1/image/upload/v1745232401/your_folder_name/ukf77s2ed5p9xv8aatfq.png",
      clientId: "6809ef1ccbc0b1ec927b395b",
      clientName: "Abhishek Kumar",
      clientAddress: "New Delhi, India",
      clientEmail: "info@xyz.com",
      clientPhone: "+91-1234567890",
      clientTaxId: "GSTIN-11223344",
      issuedAt: "2025-04-24",
      dueDate: "2025-05-24",
      paymentTerms: "Net 30",
      currencySymbol: "$",
      items: [
        {
          description: "Toothbrush",
          quantity: 15,
          rate: 10,
          discount: 0,
          total: 150,
          _id: "6809ef1ccbc0b1ec927b395f",
        },
        {
          description: "Toothpaste",
          quantity: 10,
          rate: 15,
          discount: 0,
          total: 150,
          _id: "6809ef1ccbc0b1ec927b3960",
        },
      ],
      subtotal: 300,
      deductions: [
        {
          description: "Discounts:",
          amount: 30,
          percent: 10,
          _id: "6809ef1ccbc0b1ec927b3961",
        },
      ],
      additions: [
        {
          description: "IGST @ 18%:",
          amount: 24.3,
          percent: 9,
          _id: "6809ef1ccbc0b1ec927b3962",
        },
      ],
      totalAmount: 294.3,
      notes: "Thank you for your business!",
      paymentInstructions: "Please make payment to the bank account provided.",
      status: "Pending",
    };

    setTemplates([exampleTemplate]);
    setInvoices([exampleInvoice]);
    setCurrentTemplate(exampleTemplate);
    setCurrentInvoice(exampleInvoice);
  }, []);

  const handleSaveInvoice = (updatedInvoice) => {
    // In a real application, you would send this to your API
    setInvoices((prevInvoices) => {
      const index = prevInvoices.findIndex(
        (inv) => inv.invoiceId === updatedInvoice.invoiceId
      );
      if (index !== -1) {
        const newInvoices = [...prevInvoices];
        newInvoices[index] = updatedInvoice;
        return newInvoices;
      }
      return [...prevInvoices, updatedInvoice];
    });

    setCurrentInvoice(updatedInvoice);
    setIsEditing(false);

    // Show success message
    alert("Invoice saved successfully!");
  };

  const handleCreateNewInvoice = () => {
    // Create a new invoice with default values
    const newInvoiceId =
      Math.max(...invoices.map((inv) => inv.invoiceId), 0) + 1;
    const newInvoice = {
      invoiceId: newInvoiceId,
      invoiceNumber: `INV/${newInvoiceId}/2025`,
      businessName: "My Company",
      businessAddress: "",
      businessEmail: "",
      businessPhone: "",
      businessLogo: "",
      clientName: "",
      clientAddress: "",
      clientEmail: "",
      clientPhone: "",
      clientTaxId: "",
      issuedAt: new Date().toISOString().split("T")[0],
      dueDate: "",
      paymentTerms: "Net 30",
      currencySymbol: "$",
      items: [
        {
          description: "",
          quantity: 1,
          rate: 0,
          discount: 0,
          total: 0,
          _id: `temp-${Date.now()}`,
        },
      ],
      subtotal: 0,
      deductions: [],
      additions: [],
      totalAmount: 0,
      notes: "",
      paymentInstructions: "",
      status: "Draft",
    };

    setCurrentInvoice(newInvoice);
    setIsEditing(true);
  };

  const handleEditInvoice = (invoiceId) => {
    const invoice = invoices.find((inv) => inv.invoiceId === invoiceId);
    if (invoice) {
      setCurrentInvoice(invoice);
      setIsEditing(true);
    }
  };

  const handleDownloadPDF = async () => {
    if (!currentInvoice || !currentTemplate) return;

    try {
      await generateAndDownloadInvoicePDF(currentInvoice, currentTemplate);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    }
  };

  const handlePreviewPDF = async () => {
    if (!currentInvoice || !currentTemplate) return;

    try {
      await previewInvoicePDF(currentInvoice, currentTemplate);
    } catch (error) {
      console.error("Error previewing PDF:", error);
      alert("Error previewing PDF. Please try again.");
    }
  };

  const handleTemplateChange = (e) => {
    const templateId = e.target.value;
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setCurrentTemplate(template);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className=" rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Invoice Management</h1>
            <div className="flex space-x-4">
              <button onClick={handleCreateNewInvoice} className="btn">
                Create New Invoice
              </button>

              {currentInvoice && !isEditing && (
                <>
                  <button
                    onClick={() => handleEditInvoice(currentInvoice.invoiceId)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                  >
                    Edit Current Invoice
                  </button>

                  <button
                    onClick={handleDownloadPDF}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Download PDF
                  </button>

                  <button
                    onClick={handlePreviewPDF}
                    className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                  >
                    Preview PDF
                  </button>
                </>
              )}
            </div>
          </div>

          {templates.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Template
              </label>
              <select
                className="p-2 border border-gray-300 rounded-md w-full max-w-md"
                value={currentTemplate?.id || ""}
                onChange={handleTemplateChange}
              >
                {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {isEditing && currentInvoice && currentTemplate ? (
            <InvoiceEditor
              invoiceData={currentInvoice}
              templateData={currentTemplate}
              onSave={handleSaveInvoice}
            />
          ) : currentInvoice ? (
            // The main thing is here
            <div className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Invoice Preview</h2>

              <div className="flex justify-between mb-6">
                <div>
                  {currentInvoice.businessLogo && (
                    <img
                      src={currentInvoice.businessLogo}
                      alt="Business Logo"
                      className="h-16 object-contain mb-2"
                    />
                  )}
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">
                    {currentInvoice.businessName}
                  </p>
                  <p>{currentInvoice.businessAddress}</p>
                  <p>{currentInvoice.businessEmail}</p>
                  <p>{currentInvoice.businessPhone}</p>
                </div>
              </div>

              <hr className="my-4" />

              <div className="mb-6">
                <h3 className="font-bold mb-2">Bill to</h3>
                <p>{currentInvoice.clientName}</p>
                <p>{currentInvoice.clientAddress}</p>
                <p>{currentInvoice.clientPhone}</p>
                <p>{currentInvoice.clientEmail}</p>
                {currentInvoice.clientTaxId && (
                  <p>Tax ID: {currentInvoice.clientTaxId}</p>
                )}
              </div>

              <div className="flex justify-between mb-6">
                <div>
                  <p>
                    <span className="font-medium">Invoice Number:</span>{" "}
                    {currentInvoice.invoiceNumber}
                  </p>
                  <p>
                    <span className="font-medium">Issue Date:</span>{" "}
                    {currentInvoice.issuedAt}
                  </p>
                </div>
                <div className="text-right">
                  <p>
                    <span className="font-medium">Due Date:</span>{" "}
                    {currentInvoice.dueDate}
                  </p>
                  <p>
                    <span className="font-medium">Payment Terms:</span>{" "}
                    {currentInvoice.paymentTerms}
                  </p>
                </div>
              </div>

              <table className="w-full border-collapse mb-6">
                <thead>
                  <tr className="">
                    <th className="p-2 text-left border border-gray-300">
                      Description
                    </th>
                    <th className="p-2 text-left border border-gray-300">
                      Quantity
                    </th>
                    <th className="p-2 text-left border border-gray-300">
                      Rate
                    </th>
                    <th className="p-2 text-left border border-gray-300">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentInvoice.items.map((item, index) => (
                    <tr key={item._id || index}>
                      <td className="p-2 border border-gray-300">
                        {item.description}
                      </td>
                      <td className="p-2 border border-gray-300">
                        {item.quantity}
                      </td>
                      <td className="p-2 border border-gray-300">
                        {currentInvoice.currencySymbol}
                        {item.rate.toFixed(2)}
                      </td>
                      <td className="p-2 border border-gray-300">
                        {currentInvoice.currencySymbol}
                        {item.total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-end mb-6">
                <div className="w-64">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Subtotal:</span>
                    <span>
                      {currentInvoice.currencySymbol}
                      {currentInvoice.subtotal.toFixed(2)}
                    </span>
                  </div>

                  {currentInvoice.deductions.map((deduction, index) => (
                    <div key={index} className="flex justify-between mb-2">
                      <span>{deduction.description}</span>
                      <span>
                        {currentInvoice.currencySymbol}
                        {deduction.amount.toFixed(2)}
                      </span>
                    </div>
                  ))}

                  {currentInvoice.additions.map((addition, index) => (
                    <div key={index} className="flex justify-between mb-2">
                      <span>{addition.description}</span>
                      <span>
                        {currentInvoice.currencySymbol}
                        {addition.amount.toFixed(2)}
                      </span>
                    </div>
                  ))}

                  <div className="flex justify-between font-bold border-t border-gray-300 pt-2 mt-2">
                    <span>Total:</span>
                    <span>
                      {currentInvoice.currencySymbol}
                      {currentInvoice.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {(currentInvoice.notes || currentInvoice.paymentInstructions) && (
                <div className="mt-8">
                  {currentInvoice.notes && (
                    <div className="mb-4">
                      <h3 className="font-bold mb-1">Notes:</h3>
                      <p>{currentInvoice.notes}</p>
                    </div>
                  )}

                  {currentInvoice.paymentInstructions && (
                    <div>
                      <h3 className="font-bold mb-1">Payment Instructions:</h3>
                      <p>{currentInvoice.paymentInstructions}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex justify-center items-center h-64 text-gray-500">
              No invoice selected. Please create a new invoice or select one
              from the list.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceApp;
