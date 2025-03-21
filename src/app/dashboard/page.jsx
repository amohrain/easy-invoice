"use client";
import React, { useEffect, useState } from "react";
import Nav from "../../components/Nav";
import Templates from "../../components/Templates";
import TypingPlaceholder from "../../components/TypingPlaceholder";
import { handleInvoiceGenerate } from "@/lib/openai";
import { Loading } from "@/components/Loading";
import { InvoicePreview } from "@/components/InvoicePreview";

function Dashboard() {
  const [step, setStep] = useState(1);
  const [text, setText] = useState("");
  const [templatesData, setTemplatesData] = useState([
    {
      id: "1",
      name: "Standard Business Invoice",
      structure: [
        {
          section: "header",
          position: "top",
          alignment: "right",
          bold: true, // there can be text decorations
          fields: [
            "businessName",
            "businessAddress",
            "businessEmail",
            "businessPhone",
            "businessLogo",
          ],
        },
        { section: "horizontal-line" },
        {
          section: "clientDetails",
          position: "left",
          alignment: "left",
          fields: [
            "clientName",
            "clientEmail",
            "clientPhone",
            "clientAddress",
            "clientTaxId",
          ],
        },
        {
          section: "invoiceDetails",
          position: "right",
          alignment: "left",
          fields: ["invoiceNumber", "issuedAt", "dueDate", "paymentTerms"],
        },
        { section: "space" },
        {
          section: "items",
          position: "center",
          alignment: "left",
          columns: ["description", "quantity", "unitPrice", "total"],
        },
        {
          section: "totals",
          position: "bottom",
          alignment: "right",
          fields: ["subtotal", "tax", "discount", "totalAmount"],
        },
        {
          section: "footer",
          position: "bottom",
          alignment: "center",
          fields: ["notes", "paymentInstructions"],
        },
      ],
    },
    {
      id: "2",
      name: "Another Business Invoice",
      structure: [
        {
          section: "header",
          position: "top",
          alignment: "center",
          fields: [
            "businessName",
            "businessAddress",
            "businessEmail",
            "businessPhone",
            "businessLogo",
          ],
        },
        {
          section: "clientDetails",
          position: "left",
          alignment: "left",
          fields: ["name", "email", "phone", "address", "taxId"],
        },
        {
          section: "invoiceDetails",
          position: "right",
          alignment: "left",
          fields: ["invoiceNumber", "issuedAt", "dueDate", "paymentTerms"],
        },
        {
          section: "items",
          position: "center",
          alignment: "left",
          columns: ["description", "quantity", "unitPrice", "total"],
        },
        {
          section: "totals",
          position: "bottom",
          alignment: "right",
          fields: ["subtotal", "tax", "discount", "totalAmount"],
        },
        {
          section: "footer",
          position: "bottom",
          alignment: "center",
          fields: ["notes", "paymentInstructions"],
        },
      ],
    },
    {
      id: "3",
      name: "Standard Business Invoice",
      structure: [
        {
          section: "header",
          position: "top",
          alignment: "right",
          bold: true, // there can be text decorations
          fields: [
            "businessName",
            "businessAddress",
            "businessEmail",
            "businessPhone",
            "businessLogo",
          ],
        },
        { section: "horizontal-line" },
        {
          section: "clientDetails",
          position: "left",
          alignment: "left",
          fields: [
            "clientName",
            "clientEmail",
            "clientPhone",
            "clientAddress",
            "clientTaxId",
          ],
        },
        {
          section: "invoiceDetails",
          position: "right",
          alignment: "left",
          fields: ["invoiceNumber", "issuedAt", "dueDate", "paymentTerms"],
        },
        { section: "space" },
        {
          section: "items",
          position: "center",
          alignment: "left",
          columns: ["description", "quantity", "unitPrice", "total"],
        },
        {
          section: "totals",
          position: "bottom",
          alignment: "right",
          fields: ["subtotal", "tax", "discount", "totalAmount"],
        },
        {
          section: "footer",
          position: "bottom",
          alignment: "center",
          fields: ["notes", "paymentInstructions"],
        },
      ],
    },
    {
      id: "4",
      name: "Another Business Invoice",
      structure: [
        {
          section: "header",
          position: "top",
          alignment: "center",
          fields: [
            "businessName",
            "businessAddress",
            "businessEmail",
            "businessPhone",
            "businessLogo",
          ],
        },
        {
          section: "clientDetails",
          position: "left",
          alignment: "left",
          fields: ["name", "email", "phone", "address", "taxId"],
        },
        {
          section: "invoiceDetails",
          position: "right",
          alignment: "left",
          fields: ["invoiceNumber", "issuedAt", "dueDate", "paymentTerms"],
        },
        {
          section: "items",
          position: "center",
          alignment: "left",
          columns: ["description", "quantity", "unitPrice", "total"],
        },
        {
          section: "totals",
          position: "bottom",
          alignment: "right",
          fields: ["subtotal", "tax", "discount", "totalAmount"],
        },
        {
          section: "footer",
          position: "bottom",
          alignment: "center",
          fields: ["notes", "paymentInstructions"],
        },
      ],
    },
  ]);
  const [template, setTemplate] = useState({});
  const [invoice, setInvoice] = useState({});
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [showControlsPopup, setShowControlsPopup] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    console.log("Generating invoice...");
    const invoice = await handleInvoiceGenerate(text);
    setInvoice(invoice);
    setLoading(false);
    setStep(3);
  };

  useEffect(() => {}, []);

  return (
    <>
      <Nav />
      <div className="flex flex-col h-[calc(100vh-60px)] bg-base-100 justify-center">
        <div className="w-full px-4 max-w-3xl self-center flex flex-col gap-7">
          {loading && <Loading />}
          {step == 1 && (
            <div className="flex w-full flex-col gap-4 justify-center">
              <h1 className="text-center font-bold text-4xl space-x-10">
                Choose your template
              </h1>
              <Templates
                className="self-center flex flex-row gap-4 w-full"
                templatesData={templatesData}
                template={template.id}
                setTemplate={setTemplate}
              />
              <button
                onClick={() => setStep(2)}
                className="btn btn-primary self-center"
              >
                Next
              </button>
            </div>
          )}
          {step == 2 && (
            <div className="flex flex-col gap-4">
              <h1 className="text-center font-bold text-4xl space-x-10">
                Enter your prompt
              </h1>
              <div className="p-4 flex flex-col border border-gray-100 shadow-base shadow-2xl rounded-2xl">
                <TypingPlaceholder
                  // isUsingAI={isUsingAI}
                  // isUsageExceeded={isUsageExceeded}
                  text={text}
                  setText={setText}
                />
                <div className="flex flex-row">
                  <div className="flex flex-row w-full gap-2">
                    <button
                      className={`btn rounded-3xl btn-soft btn-primary`}
                      onClick={() => setShowControlsPopup(true)}
                    >
                      Options
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      handleGenerate();
                    }}
                    className="btn btn-secondary rounded-3xl"
                  >
                    Generate
                  </button>
                </div>
              </div>
            </div>
          )}
          {step == 3 && (
            <div className="flex flex-col gap-4">
              <h1 className="text-center font-bold text-4xl space-x-10">
                Your generated invoice
              </h1>
              <div className="h-72 p-4 flex flex-col border border-gray-100 shadow-base shadow-2xl rounded-2xl">
                <InvoicePreview
                  template={template}
                  templatesData={templatesData}
                  invoice={invoice}
                  setInvoice={setInvoice}
                />
              </div>
              <button
                onClick={() => setStep(2)}
                className="btn btn-primary rounded-3xl"
              >
                Back
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
