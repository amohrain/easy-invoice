"use client";
import React, { useEffect, useState } from "react";
import LeftBar from "@/components/LeftBar";
import { useCompanyStore } from "../../../store/useCompany";
import InvoiceNumberFormat from "@/components/InvoiceNumberFormat";
import { Loading } from "../../../components/Loading";
import { toast } from "sonner";
import { useUserStore } from "../../../store/useUser";
import { useRouter } from "next/navigation";
import CompanyForm from "../../../components/CompanyForm";

function Company() {
  const { user, getCurrentUser } = useUserStore();

  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      const user = await getCurrentUser();
      if (user.subscriptionPlan !== "Pro") {
        router.push("/dashboard");
        toast.info(
          "Creating multiple companies isn't supported in current plan"
        );
      }
    }
    fetchData();
  }, []);

  const { companyData, setCompanyData } = useCompanyStore();
  const [loading, setLoading] = useState(false);
  const [logo, setLogo] = useState(null);

  useEffect(() => {
    setCompanyData({});
  }, []);

  async function uploadLogo() {
    if (!logo) return "";

    const formData = new FormData();
    formData.append("file", logo);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    return data.url;
  }

  const handleCreateCompany = async () => {
    setLoading(true);
    try {
      const data = { ...companyData };
      if (logo) {
        const logoUrl = await uploadLogo();
        data.businessLogo = logoUrl;
      }
      console.log("company data", data);
      const response = await fetch("/api/company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      toast.success("Company created successfully");
    } catch (error) {
      console.error("Error creating company:", error);
      toast.error("Error creating company");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex h-screen ">
      <LeftBar />
      <div className="flex w-full flex-col p-4 gap-6 bg-base-200 overflow-y-auto">
        {/* Main content for the Company page */}
        <div className="">
          <h1 className="text-2xl font-bold">Create New Company</h1>
          <p className="mt-2"></p>
        </div>

        <div className="px-4">
          <CompanyForm />
        </div>
      </div>
    </div>
  );
}

export default Company;
