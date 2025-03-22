"use client";
import React, { useEffect, useState } from "react";
import Nav from "../../components/Nav";
import Templates from "../../components/Templates";
import TypingPlaceholder from "../../components/TypingPlaceholder";
import { handleInvoiceGenerate } from "@/lib/openai";
import { Loading } from "@/components/Loading";
import { InvoicePreview } from "@/components/InvoicePreview";
import { templates } from "@/lib/templatesData";
import InvoicePDF from "@/components/InvoicePDF";

// For showing ReactPDF Viewer
import dynamic from "next/dynamic";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  { ssr: false }
);

function Dashboard() {
  const [step, setStep] = useState(1);
  const [text, setText] = useState("");
  const [templatesData, setTemplatesData] = useState(templates);
  const [template, setTemplate] = useState(templatesData[0]);
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
    setStep(2);
  };

  useEffect(() => {
    console.log("step: ", step);
  }, [step]);

  const TestPDF = () => (
    <Document>
      <Page size="A4">
        <View>
          <Text>Section #1</Text>
        </View>
        <View>
          <Text>Section #2</Text>
        </View>
      </Page>
    </Document>
  );

  return (
    <>
      <Nav />
      <div className="flex flex-col h-[calc(100vh-60px)] bg-base-100 justify-center">
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
                Your generated invoice
              </h1>
              <div className="h-fit p-4 flex flex-row justify-center items-center gap-4">
                <button
                  disabled={
                    templatesData.findIndex((t) => t.id === template.id) === 0
                  }
                  onClick={() => {
                    setTemplate((prev) => {
                      const index = templatesData.findIndex(
                        (t) => t.id === prev.id
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
                />
                <PDFViewer
                  style={{
                    width: "210px",
                    maxWidth: "420px",
                    aspectRatio: "210 / 297",
                    border: "1px solid #D1D5DB",
                    padding: "1rem",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    fontSize: "min(1vw, 12px)",
                  }}
                >
                  <InvoicePDF template={template} invoice={invoice} />
                </PDFViewer>
                <button
                  disabled={
                    templatesData.findIndex((t) => t.id === template.id) ===
                    templatesData.length - 1
                  }
                  onClick={() => {
                    setTemplate((prev) => {
                      const index = templatesData.findIndex(
                        (t) => t.id === prev.id
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
