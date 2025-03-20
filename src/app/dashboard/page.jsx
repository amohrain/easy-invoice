"use client";
import React, { useEffect, useState } from "react";
import Nav from "../../components/Nav";
import Templates from "../../components/Templates";
import TypingPlaceholder from "../../components/TypingPlaceholder";

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
  ]);
  const [template, setTemplate] = useState("1");
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [showControlsPopup, setShowControlsPopup] = useState(false);

  useEffect(() => {
    console.log("Template changed to: ", template);
  }, [template]);

  const handleGenerate = () => {
    console.log("Generating...");
  };

  return (
    <>
      <Nav />
      <div className="flex flex-col h-[calc(100vh-60px)] bg-base-100 justify-center">
        <div className="w-full px-4 max-w-3xl self-center flex flex-col gap-7">
          {step && (
            <div className="flex w-full flex-col gap-4 justify-center">
              <h1 className="text-center font-bold text-4xl space-x-10">
                Choose your template
              </h1>
              <Templates
                className="self-center flex flex-row gap-4 w-full"
                templatesData={templatesData}
                template={template}
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
            <div className="">
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
                    onClick={handleGenerate}
                    className="btn btn-neutral btn-circle"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="30"
                      height="30"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path
                        d="M9 4h6a1 1 0 0 1 1 1v14l-4-2-4 2V5a1 1 0 0 1 1-1z"
                        fill="currentColor"
                      />

                      <path
                        d="M18 6h.01M20 4h.01M16 4h.01M19 9h.01M14 7h.01"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
