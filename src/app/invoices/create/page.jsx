"use client";
import React, { useEffect, useState } from "react";
import TypingPlaceholder from "@/components/TypingPlaceholder";
import { handleInvoiceGenerate } from "@/lib/openai";
import { InvoicePreview } from "@/components/InvoicePreview";
import LeftBar from "@/components/LeftBar";
import { useCompanyStore } from "@/store/useCompany";
import { useTemplateStore } from "@/store/useTemplate";
import { useInvoiceStore } from "@/store/useInvoice";
import { useLoadingStore } from "@/store/useLoading";
import { useUserStore } from "../../../store/useUser";
import InvoiceSkeleton from "../../../components/InvoiceSkeleton";
import { Sparkles } from "lucide-react";

function Dashboard() {
  const [step, setStep] = useState(1);
  const [text, setText] = useState("");
  const { template, setTemplate, userTemplates, getUsersTemplates } =
    useTemplateStore();
  const [loading, setLoading] = useState(false);
  const { setInvoice, getInvoiceId, clearSuggestions } = useInvoiceStore();
  const { getCompanies } = useCompanyStore();
  const { user, getCurrentUser } = useUserStore();

  const now = new Date();
  const currentMonth = now.toISOString().slice(0, 7); // 'YYYY-MM'
  const invoiceCount =
    user?.invoiceCountMonth === currentMonth ? user?.invoiceCount : 0 || 0;

  const limitExceeded = user?.subscriptionPlan === "Free" && invoiceCount > 10;

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

      // This is redundant
      // await getInvoiceId();
      clearSuggestions();
    }
    fetchData();
  }, []);

  const handleGenerate = async () => {
    if (limitExceeded) {
      alert("Monthly invoice limit reached. Upgrade your plan to continue.");
      return;
    }

    try {
      setLoading(true);
      setStep(2);
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
    } catch (error) {
      console.log("Error generating invoice: ", error);
    }
  };

  // Todo - remove
  useEffect(() => {
    // console.log("step: ", step);
  }, [step]);

  console.log(user);

  return (
    <div className="vibe-dashboard">
      <LeftBar className="" />
      <div
        className={`flex vibe-opacity  overflow-y-auto rounded-xl flex-col w-full h-full shadow-2xl justify-center ${
          step == 2 && "max-w-5xl"
        }`}
      >
        <div className="w-full h-full self-center flex flex-row gap-8">
          {step === 2 &&
            (loading ? (
              <InvoiceSkeleton />
            ) : (
              <InvoicePreview setStep={setStep} editable />
            ))}

          {step == 1 && (
            <div className="flex px-8 w-full items-center justify-center flex-col gap-4">
              <h1 className="gradient-text text-4xl space-x-10 font-bold">
                Enter your prompt
              </h1>
              <div
                style={{
                  boxShadow: "0 0 100px 1px rgb(65, 42, 213, 0.2)", // x y blur spread color
                }}
                className="p-6 flex flex-col border w-full max-w-3xl border-primary/20 shadow-secondary rounded-2xl"
              >
                <TypingPlaceholder text={text} setText={setText} />
                <div className="flex flex-row">
                  <div className="flex flex-row w-full gap-2">
                    <button></button>
                  </div>
                  <button
                    onClick={() => {
                      handleGenerate();
                    }}
                    className="generate-button hover:scale-105"
                  >
                    <Sparkles size={18} />
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
