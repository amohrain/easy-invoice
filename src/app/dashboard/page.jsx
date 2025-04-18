"use client";
import React, { useEffect, useState } from "react";
import Nav from "../../components/Nav";
import TypingPlaceholder from "../../components/TypingPlaceholder";
import { handleInvoiceGenerate } from "../../lib/openai";
import { Loading } from "../../components/Loading";
import { InvoicePreview } from "../../components/InvoicePreview";
import dynamic from "next/dynamic";
import LeftBar from "../../components/LeftBar";
import InvoiceViewer from "../../components/InvoiceViewer";
import DownloadInvoiceButton from "../../components/DownloadInvoiceButton";
import { useCompanyStore } from "../../store/useCompany";

function Dashboard() {
  const [step, setStep] = useState(1);
  const [text, setText] = useState("");
  const [templatesData, setTemplatesData] = useState(null);
  const [template, setTemplate] = useState(null);
  const [invoice, setInvoice] = useState({});
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [showControlsPopup, setShowControlsPopup] = useState(false);
  const { company, setCompany } = useCompanyStore();

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/templates");
      const data = await response.json();
      const templates = data.data;
      console.log("Templates data: ", templates);
      setTemplatesData(templates);
      setTemplate(templates[0]);
    }
    fetchData();
  }, []);

  const handleSaveInvoice = async () => {
    try {
      setLoading(true);
      console.log("Saving invoice...");
      const response = await fetch("/api/invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invoice),
      });
      const data = await response.json();
      const savedInvoice = data.data;
    } catch (error) {
      console.error("Error saving invoice:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    console.log("Generating invoice...");
    const invoice = await handleInvoiceGenerate(text);
    // const invoice = {
    //   businessName: "My Business",
    //   businessAddress: "dg",
    //   businessEmail: "sdg",
    //   businessPhone: "g",
    //   businessLogo: "./chanel-1.jpg",
    //   clientName: "XYZ ltd",
    //   clientEmail: "info@xyz.com",
    //   clientPhone: "+91-1234567890",
    //   clientAddress: "New Delhi, India",
    //   clientTaxId: "GSTIN-11223344",
    //   invoiceNumber: "INV-123",
    //   dueDate: "",
    //   paymentTerms: "",
    //   subtotal: 300,
    //   tax: 40.5,
    //   discount: 120,
    //   totalAmount: 328.6,
    //   currencySymbol: "$",
    //   notes: "dg",
    //   paymentInstructions: "dg",
    //   items: [
    //     {
    //       description: "Toothbrush",
    //       quantity: 15,
    //       rate: 10,
    //       discount: 0,
    //       total: 1150,
    //     },
    //     {
    //       description: "Toothpaste",
    //       quantity: 10,
    //       rate: 15,
    //       discount: 0,
    //       total: 130,
    //     },
    //   ],
    //   deductions: [
    //     {
    //       description: "Discounts:",
    //       amount: 30,
    //       percent: 10,
    //     },
    //   ],
    //   additions: [
    //     {
    //       description: "IGST @ 18%:",
    //       amount: 4118.6,
    //       percent: 9,
    //     },
    //   ],
    //   issuedAt: "sdg",
    // };
    setInvoice(invoice);
    setLoading(false);
    setStep(2);
  };

  useEffect(() => {
    console.log("step: ", step);
  }, [step]);

  return (
    <>
      <div className="flex flex-row h-screen">
        <LeftBar className="w-1/5" />
        <div className="flex flex-col w-4/5 h-full bg-base-100 justify-center">
          <div className="w-full px-4 max-w-3xl self-center flex flex-col gap-7">
            {loading && <Loading />}
            {step == 1 && (
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
            {step == 2 && (
              <div className="mt-24 flex flex-col gap-4">
                <h1 className="text-center font-bold text-4xl space-x-10">
                  Give it a human touch
                </h1>
                <div className="h-fit p-4 flex flex-row justify-center items-center gap-4">
                  <button
                    disabled={
                      templatesData.findIndex((t) => t == template) === 0
                    }
                    onClick={() => {
                      setTemplate((prev) => {
                        const index = templatesData.findIndex(
                          (t) => t == template
                        );
                        if (index === 0) return prev; // Prevents going before first template
                        return templatesData[index - 1]; // Moves to previous template
                      });
                    }}
                    className="btn btn-circle btn-primary"
                  >
                    ≤
                  </button>
                  <InvoicePreview
                    template={template}
                    templatesData={templatesData}
                    invoice={invoice}
                    setInvoice={setInvoice}
                    setStep={setStep}
                  />
                  <button
                    disabled={
                      templatesData.findIndex((t) => t == template) ===
                      templatesData.length - 1
                    }
                    onClick={() => {
                      setTemplate((prev) => {
                        const index = templatesData.findIndex(
                          (t) => t == template
                        );
                        if (index === templatesData.length - 1) return prev; // Prevents going before first template
                        return templatesData[index + 1]; // Moves to previous template
                      });
                    }}
                    className="btn btn-circle btn-primary"
                  >
                    ≥
                  </button>
                </div>
              </div>
            )}
            {step == 3 && (
              <div className="mt-24 flex flex-col gap-4">
                <h1 className="text-center font-bold text-4xl space-x-10">
                  Your generated invoice. Click to download or save, whatever
                </h1>
                <div className="h-fit p-4 flex flex-col justify-center items-center gap-4">
                  <InvoiceViewer
                    invoice={invoice}
                    template={template}
                  ></InvoiceViewer>
                  <DownloadInvoiceButton
                    template={template}
                    invoice={invoice}
                  />
                  <div className="self-center flex">
                    <button
                      onClick={() => setStep((prev) => prev - 1)}
                      className="btn btn-primary w-1/2"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleSaveInvoice}
                      className="btn btn-primary w-1/2"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
