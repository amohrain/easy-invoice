"use client";
import React, { useEffect } from "react";
import { InvoicePreview } from "../../../../components/InvoicePreview";
import { useParams } from "next/navigation";
import { useInvoiceStore } from "../../../../store/useInvoice";
import { useTemplateStore } from "../../../../store/useTemplate";

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

  console.log("Template, ", template);

  if (!invoice || !template) {
    return (
      <div className="flex w-full h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div>
      <InvoicePreview editable={false} />
    </div>
  );
}

export default InvoiceViewPage;
