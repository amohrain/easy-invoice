"use client";
import React, { useState, useEffect } from "react";
import TypingPlaceholder from "@/components/TypingPlaceholder";
import { dummyInvoice } from "../lib/dummyInvoice";
import { useClientStore } from "../store/useClient";
import { useInvoiceStore } from "../store/useInvoice";
import { InvoicePreview } from "../components/InvoicePreview";
import { templates } from "../lib/templatesData";
import { useTemplateStore } from "../store/useTemplate";
import { sampleCompany } from "../constants/sampleCompany";
import { clients } from "../constants/clients";
import { handleInvoiceGenerate } from "../lib/openai";
import { calculateInvoice } from "../lib/calculate";
import { Loading } from "../components/Loading";
import { samplePrompts } from "../constants/samplePrompts";

function Demo() {
  const { setTemplate } = useTemplateStore();
  const [loading, setLoading] = useState();
  const { invoice, setInvoice } = useInvoiceStore();
  const [text, setText] = useState("");
  const [step, setStep] = useState(1);
  const { clientId, setSampleClients } = useClientStore();

  useEffect(() => {
    setTemplate(templates[0]);
    const client = setSampleClients();
    setText(`@${client.clientName}
${client.clientEmail}

${samplePrompts[Math.floor(Math.random() * samplePrompts.length)]}`);
  }, []);

  const handleGenerate = async () => {
    try {
      setLoading(true);

      const invoiceInfo = {
        issuedAt: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        invoiceNumber: "INV-001",
        dueDate: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      };

      const invoice = await handleInvoiceGenerate(text);
      // const invoice = dummyInvoice;
      const updatedInvoice = calculateInvoice(invoice);
      const clientInfo = clients.find((client) => client._id === clientId);

      setInvoice({
        ...updatedInvoice,
        ...clientInfo,
        ...sampleCompany,
        ...invoiceInfo,
      });
      setLoading(false);
      setStep(2);
    } catch (error) {
      console.log("Error generating invoice: ", error);
    }
  };

  const PreviewModal = () => {
    return (
      <div className="fixed inset-0 bg-base-100 flex flex-col items-center justify-center z-50 overflow-y-auto">
        <InvoicePreview setStep={setStep} preview={true} editable={true} />
      </div>
    );
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div
      id="interactive-demo"
      className="min-h-screen flex flex-col items-center justify-center gap-8 px-4 sm:px-4 sm:py-12"
    >
      <div className="section-heading">
        <h2 className="section-title">Playground and interactive demo</h2>
        <p className="section-description mt-5">Try it yourself below</p>
      </div>
      <div className="w-full max-w-4xl p-2 sm:p-4 flex flex-col justify-center border border-gray-100 shadow-base shadow-2xl rounded-2xl">
        <TypingPlaceholder isUsingAI={true} text={text} setText={setText} />
        <div className="flex flex-row">
          <div className="flex flex-row w-full gap-2"></div>
          {/* <img
            src="/vibes.png"
            disabled={!clientId}
            onClick={() => {
              handleGenerate();
            }}
            alt="Generate"
            className="bg-primary p-1 size-12 rounded-full cursor-pointer shadow-2xl shadow-amber-400"
          /> */}
          <button
            disabled={!clientId}
            onClick={() => {
              handleGenerate();
            }}
            className="btn btn-primary rounded-3xl"
          >
            Generate
          </button>
        </div>
      </div>
      {step == 2 && <PreviewModal />}
    </div>
  );
}

export default Demo;
