"use client";
import React, { useEffect } from "react";
import { InvoicePreview } from "@/components/InvoicePreview";
import { useParams } from "next/navigation";
import { useInvoiceStore } from "@/store/useInvoice";
import { useTemplateStore } from "@/store/useTemplate";
import InvoiceSkeleton from "../../../components/InvoiceSkeleton";
import { div } from "framer-motion/client";

function InvoiceViewPage() {
  const { invoice, getInvoiceById, fetchSuggestion } = useInvoiceStore();
  const { template, getTemplateById, getUsersTemplates } = useTemplateStore();
  const { id } = useParams();

  useEffect(() => {
    async function fetchData() {
      const inv = await getInvoiceById(id);
      const templates = await getTemplateById(inv.template);
      if (inv.changesSuggested) await fetchSuggestion();
    }
    fetchData();
  }, []);

  return (
    <div className="vibe-dashboard w-full">
      <div className="overflow-y-auto w-full flex justify-center">
        <div className="w-full max-w-5xl rounded-xl">
          {!invoice || !template ? (
            <InvoiceSkeleton />
          ) : (
            <InvoicePreview editable={false} />
          )}
        </div>
      </div>
    </div>
  );
}

export default InvoiceViewPage;
