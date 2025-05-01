"use client";
import React, { useEffect, useState } from "react";
import TypingPlaceholder from "@/components/TypingPlaceholder";
import { handleInvoiceGenerate } from "@/lib/openai";
import { Loading } from "@/components/Loading";
import { InvoicePreview } from "@/components/InvoicePreview";
import LeftBar from "@/components/LeftBar";
import InvoiceViewer from "@/components/InvoiceViewer";
import DownloadInvoiceButton from "@/components/DownloadInvoiceButton";
import { useCompanyStore } from "@/store/useCompany";
import { useTemplateStore } from "@/store/useTemplate";
import { dummyInvoice } from "@/lib/dummyInvoice";
import { useInvoiceStore } from "@/store/useInvoice";
import { Link2, Printer, Save } from "lucide-react";
import DownloadIcon from "@/components/DownloadIcon";
import { useStepsStore } from "@/store/useSteps";
import { useLoadingStore } from "@/store/useLoading";
import { calculateInvoice } from "../../../lib/calculate";

function Dashboard() {
  const [step, setStep] = useState(1);
  // const { step, setStep } = useStepsStore();
  const [text, setText] = useState("");
  const [showControlsPopup, setShowControlsPopup] = useState(false);

  const { template, setTemplate, userTemplates, getUsersTemplates } =
    useTemplateStore();
  const { loading, setLoading } = useLoadingStore();

  const { invoice, setInvoice, getInvoiceId, clearSuggestions } =
    useInvoiceStore();
  const { company, setCompany, getCompanies } = useCompanyStore();

  useEffect(() => {
    async function fetchData() {
      await getUsersTemplates();
      await getCompanies();
      await getInvoiceId();
      clearSuggestions();
    }
    fetchData();
  }, []);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const invoice = await handleInvoiceGenerate(text);
      const updatedInvoice = calculateInvoice(invoice);
      // const invoice = dummyInvoice;
      setInvoice(updatedInvoice);
      setLoading(false);
      setStep(2);
    } catch (error) {
      console.log("Error generating invoice: ", error);
    }
  };

  useEffect(() => {
    console.log("step: ", step);
  }, [step]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex w-full flex-row h-screen">
      <LeftBar className="" />
      <div className="flex flex-col w-full h-full bg-base-100 justify-center">
        <div className="w-full h-full self-center flex flex-row gap-8 overflow-y-auto">
          {step == 2 && (
            // <InvoicePreview setStep={setStep}/>
            <InvoicePreview setStep={setStep} editable={true} />
          )}
          {step == 1 && (
            <div className="flex px-8 w-full items-center justify-center flex-col gap-4">
              <h1 className="text-center font-bold text-4xl space-x-10">
                {step == 1 ? "Enter your prompt" : "Your invoice is ready!"}
              </h1>
              <div className="p-4 flex flex-col border w-full max-w-3xl border-gray-100 shadow-base shadow-2xl rounded-2xl">
                <TypingPlaceholder text={text} setText={setText} />
                <div className="flex flex-row">
                  <div className="flex flex-row w-full gap-2">
                    <button></button>
                  </div>
                  <button
                    onClick={() => {
                      handleGenerate();
                    }}
                    className="btn btn-accent rounded-3xl"
                  >
                    Generate
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
