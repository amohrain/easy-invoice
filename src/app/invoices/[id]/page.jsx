"use client";
import React, { useEffect } from "react";
import { InvoicePreview } from "../../../components/InvoicePreview";
import { useInvoiceStore } from "../../../store/useInvoice";
import { useParams } from "next/navigation";
import LeftBar from "../../../components/LeftBar";
import { useTemplateStore } from "../../../store/useTemplate";
import { Link, Link2, Printer, Save } from "lucide-react";
import DownloadIcon from "../../../components/DownloadIcon";

function InvoicePage() {
  const { id } = useParams();
  const { invoice, setInvoice, getInvoiceById, saveInvoice } =
    useInvoiceStore();
  const { template, getUsersTemplates } = useTemplateStore();

  useEffect(() => {
    async function fetchData() {
      const inv = await getInvoiceById(id);
      const templates = await getUsersTemplates(inv.template);
    }
    fetchData();
  }, []);

  if (!invoice || !template) {
    return (
      <div className="flex w-full h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="flex w-full h-screen">
      <LeftBar />
      <div className="flex w-full justify-center">
        <div className="flex flex-col p-4 gap-4 justify-center self-center">
          <InvoicePreview />
        </div>
      </div>
    </div>
  );
}

export default InvoicePage;
