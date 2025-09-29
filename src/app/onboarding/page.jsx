"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
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
      setStep(3);
      setLoading(false);
    }
  };

  const handleNext = async () => {
    if (step === 1) {
      setStep((prev) => prev + 1);
      return;
    } else if (step === 2) {
      await handleCreateCompany();
      return;
    } else if (step >= 3) {
      router.push("/invoices/create");
    }
  };

  return (
    <div className="h-screen w-full vibe-gradient pt-16 p-4">
      <div className="max-w-4xl w-full mx-auto vibe-opacity border border-primary/20 p-6 bg-base rounded-lg shadow-md text-center">
        {step === 1 && (
          <div>
            <h2 className="gradient-text text-3xl font-bold">
              Welcome, {user?.firstName}!
            </h2>
            <p className="section-description mt-2">
              Let's get you set up with Vibe Invoice.
            </p>
          </div>
        )}
        {step === 2 && (
          <div className="">
            <h2 className="gradient-text text-3xl font-bold">
              Your Company Details
            </h2>
            <p className="section-description mt-2">
              Please provide your company information to continue.
            </p>
            <div className="rounded-lg border border-primary/20 mt-4">
              <CompanyForm setStep={setStep} />
            </div>
          </div>
        )}
        {step === 3 && (
          <div>
            <h2 className="gradient-text text-3xl font-bold">
              You're all set!
            </h2>
            <p className="section-description mt-2">
              Click finish button to get started with your first project
            </p>
          </div>
        )}
        <button
          className="generate-button mt-6 w-fit text-lg"
          disabled={loading}
          onClick={handleNext}
        >
          {loading && (
            <span className="loading loading-spinner loading-sm"></span>
          )}
          {step >= 3 ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
}
