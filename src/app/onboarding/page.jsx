"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Loading } from "../../components/Loading";
import { useUserStore } from "../../store/useUser";
import { useCompanyStore } from "../../store/useCompany";
import CompanyForm from "../../components/CompanyForm";

export default function Onboarding() {
  const router = useRouter();
  const { user } = useUser();
  const [step, setStep] = useState(1);

  const { getCurrentUser } = useUserStore();

  useEffect(() => {
    async function checkIfOnboarded() {
      const response = await fetch("/api/company");
      const data = await response.json();
      const companies = data.data;

      if (companies?.length > 0) router.push("/invoices/create");
    }
    checkIfOnboarded();
  }, []);

  const { logo, setLogo, loading, setLoading, companyData, setCompanyData } =
    useCompanyStore();

  async function uploadLogo() {
    if (!logo) return "";

    const formData = new FormData();
    formData.append("file", logo);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log("Uploaded Image URL:", data.url);
    return data.url;
  }

  const handleCreateCompany = async () => {
    setLoading(true);
    try {
      // Call an API route to update publicMetadata
      const resUser = await fetch("/api/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.fullName,
          email: user.emailAddresses[0].emailAddress,
          subscriptionPlan: "Free",
        }),
      });
      if (!resUser.ok) {
        throw new Error("Failed to update user data");
      }
      const data = { ...companyData };
      if (logo) {
        const logoUrl = await uploadLogo();
        data.businessLogo = logoUrl;
      }
      console.log("company data", data);
      const resCompany = await fetch("/api/company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!resCompany.ok) {
        throw new Error("Failed to create company");
      }
    } catch (error) {
      console.error("Error creating user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    if (step === 2) {
      await handleCreateCompany();
      setStep((prev) => prev + 1);
      return;
    } else if (step >= 3) {
      router.push("/invoices/create");
    } else setStep((prev) => prev + 1);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-4xl w-fit mx-auto mt-24 p-6 bg-base border rounded-lg shadow-md">
      {step === 1 && (
        <div>
          <h2 className="text-2xl font-bold">Welcome, {user?.firstName}!</h2>
          <p className="mt-2">Let's get you set up with Easy Invoice.</p>
        </div>
      )}
      {step === 2 && (
        <div className="">
          <h2 className="text-xl text-center font-bold">
            Your Company Details
          </h2>
          <CompanyForm setStep={setStep} />
        </div>
      )}
      {step === 3 && (
        <div>
          <h2 className="text-2xl font-bold">You're all set!</h2>
          <p className="mt-2">
            Click finish button to get started with your first project
          </p>
        </div>
      )}
      <button className="btn btn-accent mt-6 w-full" onClick={handleNext}>
        {step >= 3 ? "Finish" : "Next"}
      </button>
    </div>
  );
}
