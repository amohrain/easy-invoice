"use client";
import React, { useEffect, useState } from "react";
import TypingPlaceholder from "@/components/TypingPlaceholder";
import { handleInvoiceGenerate } from "@/lib/openai";
import { Loading } from "@/components/Loading";
import { InvoicePreview } from "@/components/InvoicePreview";
import LeftBar from "@/components/LeftBar";
import { useCompanyStore } from "@/store/useCompany";
import { useTemplateStore } from "@/store/useTemplate";
import { dummyInvoice } from "@/lib/dummyInvoice";
import { useInvoiceStore } from "@/store/useInvoice";
import { useLoadingStore } from "@/store/useLoading";
import { calculateInvoice } from "../../../lib/calculate";
import { useUserStore } from "../../../store/useUser";

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

  const { user, getCurrentUser } = useUserStore();

  const now = new Date();
  const currentMonth = now.toISOString().slice(0, 7); // 'YYYY-MM'
  const invoiceCount =
    true || user?.invoiceCountMonth === currentMonth
      ? user?.invoiceCount
      : 0 || 0;

  const limitExceeded = user?.subscriptionPlan === "Free" && invoiceCount >= 15;

  const [startTime, setStartTime] = useState(0);

  useEffect(() => {
    // start counting time when the user starts typing for the first time
    if (text.length > 0 && startTime === 0) {
      const start = performance.now();
      setStartTime(start);
    }
    if (text.length === 0) {
      setStartTime(0);
    }
  }, [text]);

  useEffect(() => {
    async function fetchData() {
      await getCurrentUser();
      await getUsersTemplates();
      await getCompanies();
      await getInvoiceId();
      clearSuggestions();
    }
    fetchData();
  }, []);

  const handleGenerate = async () => {
    console.log("Limit exceeded: ", limitExceeded);
    if (limitExceeded) {
      alert("Monthly invoice limit reached. Upgrade your plan to continue.");
      return;
    }

    try {
      setLoading(true);
      const invoice = await handleInvoiceGenerate(text);

      // Logic to calculate time taken to generate invoice
      const end = performance.now();
      const durationInSeconds = ((end - startTime) / 1000).toFixed(2);
      invoice.timeTaken = parseFloat(durationInSeconds);

      // const updatedInvoice = calculateInvoice(invoice);
      // const invoice = dummyInvoice;
      // Todo - invoice validation check to reduce errors
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
    <div className="flex w-full flex-row h-screen">
      <LeftBar className="" />
      <div className="flex flex-col w-full h-full bg-base-100 justify-center">
        <div className="w-full h-full self-center flex flex-row gap-8 overflow-y-auto">
          {step == 2 && <InvoicePreview setStep={setStep} editable={true} />}
          {step == 1 && (
            <div className="flex px-8 w-full items-center justify-center flex-col gap-4">
              <h1 className="text-center font-bold text-4xl space-x-10">
                {step == 1 ? "Enter your prompt" : "Your invoice is ready!"}
              </h1>
              <div className="p-4 flex flex-col border w-full max-w-3xl border-base-content/10 shadow-primary/50 shadow-2xl rounded-2xl">
                <TypingPlaceholder text={text} setText={setText} />
                <div className="flex flex-row">
                  <div className="flex flex-row w-full gap-2">
                    <button></button>
                  </div>
                  <button
                    onClick={() => {
                      handleGenerate();
                    }}
                    className="btn btn-primary rounded-3xl"
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
