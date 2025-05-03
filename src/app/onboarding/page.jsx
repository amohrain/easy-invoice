"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Loading } from "../../components/Loading";
import { useUserStore } from "../../store/useUser";

export default function Onboarding() {
  const router = useRouter();
  const { user } = useUser();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: user?.firstName || "",
    position: "",
    industry: "",
  });

  const { getCurrentUser } = useUserStore();

  useEffect(() => {
    async function checkIfOnboarded() {
      const response = await fetch("/api/company");
      const data = await response.json();
      const companies = data.data;

      if (companies?.length > 0) router.push("/dashboard");
    }
    checkIfOnboarded();
  }, []);

  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(false);

  const [companyData, setCompanyData] = useState({
    businessLogo: "",
    businessName: "",
    businessAddress: "",
    businessEmail: "",
    businessPhone: "",
    businessTaxId: "",
    currency: "$",
  });

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

  const handleSubmit = async () => {
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
      await handleSubmit();
      setStep((prev) => prev + 1);
      return;
    } else if (step === 3) {
      router.push("/invoices/create");
    } else setStep((prev) => prev + 1);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-md mx-auto mt-24 p-6 bg-base border rounded-lg shadow-md">
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
          <fieldset className="fieldset bg-base-100 shadow p-2 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Left Column */}
              <div>
                <div className="mb-4">
                  <label className="fieldset-label block mb-2">
                    Company Logo
                  </label>
                  <div className="flex justify-center mb-2">
                    {logo && (
                      <img
                        src={URL.createObjectURL(logo)}
                        alt="Company Logo"
                        className="h-10 w-auto object-contain rounded"
                      />
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="file-input file-input-border w-full"
                    onChange={(e) => setLogo(e.target.files[0])}
                  />
                </div>
                <div className="mb-4">
                  <label className="fieldset-label block mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="Easy Invoice"
                    value={companyData?.businessName || ""}
                    onChange={(e) =>
                      setCompanyData({
                        ...companyData,
                        businessName: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="mb-4">
                  <label className="fieldset-label block mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="input input-bordered w-full"
                    placeholder="(555) 123-4567"
                    value={companyData?.businessPhone || ""}
                    onChange={(e) =>
                      setCompanyData({
                        ...companyData,
                        businessPhone: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="mb-4">
                  <label className="fieldset-label block mb-2">Email</label>
                  <input
                    type="email"
                    className="input input-bordered w-full"
                    placeholder="contact@easyinvoice.com"
                    value={companyData?.businessEmail || ""}
                    onChange={(e) =>
                      setCompanyData({
                        ...companyData,
                        businessEmail: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* Middle Column */}
              <div>
                <div className="mb-4">
                  <label className="fieldset-label block mb-2">Address</label>
                  <textarea
                    className="textarea textarea-bordered w-full h-22 resize-none"
                    placeholder="123 Business St, Suite 101, City, State, 12345"
                    value={companyData?.businessAddress || ""}
                    onChange={(e) =>
                      setCompanyData({
                        ...companyData,
                        businessAddress: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="mb-4">
                  <label className="fieldset-label block mb-2">
                    Tax ID / VAT Number
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="123-45-6789"
                    value={companyData?.businessTaxId || ""}
                    onChange={(e) =>
                      setCompanyData({
                        ...companyData,
                        businessTaxId: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="mb-4">
                  <label className="fieldset-label block mb-2">Currency</label>
                  <select
                    className="select select-bordered w-full"
                    value={companyData?.currency || "$"}
                    onChange={(e) =>
                      setCompanyData({
                        ...companyData,
                        currency: e.target.value,
                      })
                    }
                  >
                    <option value="$">USD ($)</option>
                    <option value="€">EUR (€)</option>
                    <option value="£">GBP (£)</option>
                    <option value="₹">INR (₹)</option>
                  </select>
                </div>
              </div>
            </div>
          </fieldset>
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
        {step === 3 ? "Finish" : "Next"}
      </button>
    </div>
  );
}
