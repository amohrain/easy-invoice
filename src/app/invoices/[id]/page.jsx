"use client";
import React, { useEffect } from "react";
import { InvoicePreview } from "@/components/InvoicePreview";
import { useInvoiceStore } from "@/store/useInvoice";
import { useParams } from "next/navigation";
import LeftBar from "@/components/LeftBar";
import { useTemplateStore } from "@/store/useTemplate";
import InvoiceSkeleton from "../../../components/InvoiceSkeleton";

function InvoicePage() {
  const { id } = useParams();
  const { invoice, setInvoice, getInvoiceById, saveInvoice, fetchSuggestion } =
    useInvoiceStore();
  const { template, getUsersTemplates } = useTemplateStore();

  useEffect(() => {
    async function fetchData() {
      const inv = await getInvoiceById(id);
      const templates = await getUsersTemplates(inv.template);
      if (inv.changesSuggested) await fetchSuggestion();
    }
    fetchData();
  }, []);

  return (
    <div className="vibe-dashboard">
      <LeftBar />
      <div className="w-full max-w-5xl h-full flex flex-row gap-8 rounded-xl shadow-2xl overflow-y-auto">
        {!invoice || !template ? (
          <InvoiceSkeleton />
        ) : (
          <InvoicePreview editable={true} />
        )}
      </div>
    </div>
  );
}

export default InvoicePage;
