"use client";
import React, { useEffect, useState } from "react";
import LeftBar from "@/components/LeftBar";
import { useCompanyStore } from "@/store/useCompany";
// import InvoiceNumberFormat from "@/components/InvoiceNumberFormat";
import { Plus } from "lucide-react";
import { useUserStore } from "../../store/useUser";

import CompanyForm from "../../components/CompanyForm";

function Company() {
  const { companyData } = useCompanyStore();

  const [isPro, setIsPro] = useState(false);
  const { getCurrentUser } = useUserStore();

  useEffect(() => {
    async function fetchData() {
      const user = await getCurrentUser();
      if (user.subscriptionPlan === "Pro") {
        setIsPro(true);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="flex h-screen ">
      <LeftBar />
      <div className="flex w-full flex-col p-4 gap-6 bg-base-200 overflow-y-auto">
        {/* Main content for the Company page */}
        <div className="flex justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {companyData?.businessName || "My Company"}
            </h1>
            <p className="mt-2">
              This is the company page. Here you can manage your company details
              and preferences.
            </p>
          </div>
          {isPro && (
            <button className="btn btn-primary">
              <Plus />
              Create new
            </button>
          )}
        </div>

        <CompanyForm />
      </div>
    </div>
  );
}

export default Company;
