"use client";
import React, { useEffect, useState } from "react";
import LeftBar from "@/components/LeftBar";
import { useCompanyStore } from "@/store/useCompany";
import InvoiceNumberFormat from "@/components/InvoiceNumberFormat";

function Company() {
  const {
    company,
    setCompany,
    companyData,
    setCompanyData,
    getCompanies,
    updateCompany,
  } = useCompanyStore();

  const [logo, setLogo] = useState(null);
  const [preview, setPreview] = useState(company?.businessLogo || null);

  console.log("Company logo", preview);

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

  const handleUpdateCompany = async () => {
    const logoUrl = await uploadLogo();
    // const logoUrl = "";
    const updatedData = {
      ...companyData,
      businessLogo: logoUrl,
    };

    await updateCompany(updatedData);
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      await getCompanies();
    };
    fetchCompanies();
  }, [updateCompany]);

  return (
    <div className="flex h-screen ">
      <LeftBar />
      <div className="flex w-full flex-col p-4 gap-6 bg-base-200 overflow-y-auto">
        {/* Main content for the Company page */}
        <div className="">
          <h1 className="text-2xl font-bold">
            {companyData?.businessName || "My Company"}
          </h1>
          <p className="mt-2">
            This is the company page. Here you can manage your company details
            and preferences.
          </p>
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
                    {preview && !logo && (
                      <img
                        src={preview}
                        alt="Company Logo"
                        className="h-10 w-auto object-contain rounded self-center"
                      />
                    )}
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
                onClick={handleUpdateCompany}
              >
                Update Company Information
              </button>
            </div>
          </fieldset>
        </div>
      </div>
    </div>
  );
}

export default Company;
