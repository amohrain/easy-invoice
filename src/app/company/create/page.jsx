"use client";
import React, { useEffect, useState } from "react";
import LeftBar from "@/components/LeftBar";
import { useCompanyStore } from "@/store/useCompany";
import InvoiceNumberFormat from "@/components/InvoiceNumberFormat";
import { Loading } from "../../../components/Loading";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { useUserStore } from "../../../store/useUser";
import { useRouter } from "next/navigation";

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

  const [companyData, setCompanyData] = useState({
    businessLogo: "",
    businessName: "",
    businessAddress: "",
    businessEmail: "",
    businessPhone: "",
    businessTaxId: "",
    notes: "",
    paymentInstructions: "",
    currency: "$",
  });
  const [loading, setLoading] = useState(false);
  const [logo, setLogo] = useState(null);

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
          <fieldset className="fieldset bg-base-100 shadow p-4 rounded-lg">
            {/* <legend className="text-lg font-medium">Company Information</legend> */}

            {/* Two-column layout for form fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
                  <label className="fieldset-label block mb-2">
                    Invoice Number Format
                  </label>
                  <InvoiceNumberFormat />
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

              {/* Right Column */}
              <div>
                <div className="mb-4">
                  <label className="fieldset-label block mb-2">
                    Payment Instructions
                  </label>
                  <textarea
                    className="textarea textarea-bordered w-full h-22 resize-none"
                    placeholder="Please pay before the due date"
                    value={companyData?.paymentInstructions || ""}
                    onChange={(e) =>
                      setCompanyData({
                        ...companyData,
                        paymentInstructions: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-4">
                  <label className="fieldset-label block mb-2">Notes</label>
                  <textarea
                    className="textarea textarea-bordered w-full h-30 resize-none"
                    placeholder="Thank you for the business!"
                    value={companyData?.notes || ""}
                    onChange={(e) =>
                      setCompanyData({
                        ...companyData,
                        notes: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-4">
                  <label className="fieldset-label block mb-2">Website</label>
                  <input
                    type="url"
                    className="input input-bordered w-full"
                    placeholder="https://easyinvoice.com"
                    value={companyData?.businessWebsite || ""}
                    onChange={(e) =>
                      setCompanyData({
                        ...companyData,
                        businessWebsite: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <button
                className="btn btn-primary mt-4 w-full md:w-fit"
                onClick={handleCreateCompany}
              >
                Create Company
              </button>
            </div>
          </fieldset>
        </div>
      </div>
    </div>
  );
}

export default Company;
