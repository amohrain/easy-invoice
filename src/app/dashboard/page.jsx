"use client";
import React, { useEffect, useState } from "react";
import TypingPlaceholder from "../../components/TypingPlaceholder";
import { handleInvoiceGenerate } from "../../lib/openai";
import { Loading } from "../../components/Loading";
import { InvoicePreview } from "../../components/InvoicePreview";
import LeftBar from "../../components/LeftBar";
import InvoiceViewer from "../../components/InvoiceViewer";
import DownloadInvoiceButton from "../../components/DownloadInvoiceButton";
import { useCompanyStore } from "../../store/useCompany";
import { useTemplateStore } from "../../store/useTemplate";
import { dummyInvoice } from "../../lib/dummyInvoice";
import { useInvoiceStore } from "../../store/useInvoice";
import { Link2, Printer, Save } from "lucide-react";
import DownloadIcon from "../../components/DownloadIcon";
import { useStepsStore } from "../../store/useSteps";
import { useLoadingStore } from "../../store/useLoading";

function Dashboard() {
  const [step, setStep] = useState(1);
  // const { step, setStep } = useStepsStore();
  const [text, setText] = useState("");
  const [showControlsPopup, setShowControlsPopup] = useState(false);

  const { template, setTemplate, templatesData, getTemplatesData } =
    useTemplateStore();
  const { loading, setLoading } = useLoadingStore();

  const { invoice, setInvoice, getInvoiceId } = useInvoiceStore();
  const { company, setCompany, getCompanies } = useCompanyStore();

  useEffect(() => {
    async function fetchData() {
      const templa = await getTemplatesData();
      await getCompanies();
      await getInvoiceId();
    }
    fetchData();
  }, []);

  console.log("Templates Data: ", template, templatesData);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      // const invoice = await handleInvoiceGenerate(text);
      const invoice = dummyInvoice;
      setInvoice(invoice);
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
    <div className="flex flex-row h-screen">
      <LeftBar className="" />
      <div className="flex flex-col w-full h-full bg-base-100 justify-center">
        <div className="w-full px-4 self-center flex flex-row">
          {step == 2 && (
            <div className="flex flex-col">
              <InvoicePreview setStep={setStep} />
            </div>
          )}

          <div className="flex w-full items-center justify-center flex-col gap-4">
            <h1 className="text-center font-bold text-4xl space-x-10">
              {step == 1 ? "Enter your prompt" : "Your invoice is ready!"}
            </h1>
            <div className="p-4 flex flex-col border w-full max-w-3xl border-gray-100 shadow-base shadow-2xl rounded-2xl">
              <TypingPlaceholder text={text} setText={setText} />
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

          {/* {step == 3 && (
            <div className="mt-24 flex flex-col gap-4">
              <h1 className="text-center font-bold text-4xl space-x-10">
                Your generated invoice. Click to download or save, whatever
              </h1>
              <div className="h-fit p-4 flex flex-col justify-center items-center gap-4">
                <InvoiceViewer
                  invoice={invoice}
                  template={template}
                ></InvoiceViewer>
                <DownloadInvoiceButton template={template} invoice={invoice} />
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
          )} */}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
