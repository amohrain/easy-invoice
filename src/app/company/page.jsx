"use client";
import React, { useEffect, useState } from "react";
import LeftBar from "@/components/LeftBar";
import { useCompanyStore } from "@/store/useCompany";
// import InvoiceNumberFormat from "@/components/InvoiceNumberFormat";
import { Plus } from "lucide-react";

import CompanyForm from "../../components/CompanyForm";
import APIKeyCompany from "../../components/APIKeyCompany";

function Company() {
  const { companyData } = useCompanyStore();

  return (
    <div className="vibe-dashboard">
      <LeftBar />
      <div className="flex w-full flex-col p-4 gap-6 overflow-y-auto">
        {/* Main content for the Company page */}
        <div className="flex justify-between">
          <div>
            <h1 className="gradient-text text-3xl font-bold">
              {companyData?.businessName || "My Company"}
            </h1>
            <p className="mt-2">
              This is the company page. Here you can manage your company details
              and preferences.
            </p>
          </div>
        </div>

        <div className="vibe-opacity rounded-xl">
          <CompanyForm />
        </div>
        <APIKeyCompany />
      </div>
    </div>
  );
}

export default Company;
