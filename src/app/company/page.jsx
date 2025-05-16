"use client";
import React, { useEffect, useState } from "react";
import LeftBar from "@/components/LeftBar";
import { useCompanyStore } from "@/store/useCompany";
import InvoiceNumberFormat from "@/components/InvoiceNumberFormat";
import { Copy, CopyCheck, ExternalLink, Plus, Trash2 } from "lucide-react";
import { useUserStore } from "../../store/useUser";
import { toast } from "sonner";
import Link from "next/link";

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
  const [isPro, setIsPro] = useState(false);
  const { getCurrentUser } = useUserStore();
  const [preview, setPreview] = useState(company?.businessLogo || null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const user = await getCurrentUser();
      if (user.subscriptionPlan === "Pro") {
        setIsPro(true);
      }
    }
    fetchData();
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
    console.log("Uploaded Image URL:", data.url);
    return data.url;
  }

  const handleUpdateCompany = async () => {
    // const logoUrl = "";
    const updatedData = {
      ...companyData,
    };

    if (logo) {
      const logoUrl = await uploadLogo();
      updatedData.businessLogo = logoUrl;
    }
    console.log("Updating company with, ", updatedData);
    await updateCompany(updatedData);
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      await getCompanies();
    };
    fetchCompanies();
  }, [updateCompany]);

  const handleGenerateAPIKey = async () => {
    try {
      const res = await fetch("/api/company/api-key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ companyId: company._id }),
      });
      const data = await res.json();
      console.log("API Key generated", data);
      if (data.success) {
        toast.success("API key generated successfully");
        setCompany({ ...company, apiKey: data.apiKey });
      }
    } catch (error) {
      console.error("Error generating API key:", error);
      toast.error("Error generating API key");
    }
  };

  const handleDeleteAPIKey = async () => {
    try {
      const res = await fetch("/api/company/api-key", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyId: company._id,
          apiKey: company.apiKey,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("API key deleted successfully");
        setCompany({ ...company, apiKey: null });
        setShowDeleteModal(false);
      }
    } catch (error) {
      console.error("Error deleting API key:", error);
      toast.error("Error deleting API key");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(company.apiKey);
    setCopied(true);
    toast.success("API key copied to clipboard");
  };

  useEffect(() => {
    setTimeout(() => {
      setCopied(false);
    }, 10000);
  }, [copied == true]);

  const DeleteAPIKeyModal = () => {
    return (
      <dialog
        id="my_modal_5"
        className="modal modal-open modal-bottom sm:modal-middle"
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">Delete API Key!</h3>
          <p className="py-4">
            Are you sure you want to delete the API key? This action cannot be
            undone. If you delete the API key, you will need to generate a new
            one to access the API. This will also invalidate any existing API
            keys.
          </p>
          <div className="modal-action gap-2">
            <form method="dialog">
              <button onClick={handleDeleteAPIKey} className="btn btn-error">
                Delete
              </button>
              <button onClick={() => setShowDeleteModal(false)} className="btn">
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>
    );
  };

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

        <div className="">
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
                  <div className="flex justify-center h-10 mb-2">
                    {company.businessLogo && !logo && (
                      <img
                        src={company.businessLogo}
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
                    value={companyData?.currency || "USD"}
                    onChange={(e) =>
                      setCompanyData({
                        currency: e.target.value,
                      })
                    }
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="INR">INR (₹)</option>
                    <option value="JPY">JPY (¥)</option>
                    <option value="CNY">CNY (¥)</option>
                    <option value="AUD">AUD ($)</option>
                    <option value="CAD">CAD ($)</option>
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
            <div className="flex items-center justify-between">
              <button
                className="btn self-center btn-primary w-full md:w-fit"
                onClick={handleUpdateCompany}
              >
                Update Company Information
              </button>
              <div className="flexitems-center">
                {company?.apiKey ? (
                  <div className="flex bg-base-200 p-4 rounded-2xl gap-2">
                    <span className="text-sm self-center mr-2">
                      API Key: {company.apiKey}
                    </span>
                    <button onClick={handleCopy}>
                      {copied ? (
                        <CopyCheck className="size-4 self-center hover:cursor-pointer text-accent" />
                      ) : (
                        <Copy className="size-4 self-center hover:cursor-pointer hover:text-accent" />
                      )}
                    </button>
                    <Trash2
                      onClick={() => setShowDeleteModal(true)}
                      className="size-4 self-center hover:cursor-pointer  hover:text-error"
                    />
                    <Link target="_blank" href="/docs">
                      <button className="btn rounded-full">
                        Api Docs
                        <ExternalLink className="size-4" />
                      </button>
                    </Link>
                  </div>
                ) : (
                  <button onClick={handleGenerateAPIKey} className="btn">
                    Generate API Key
                  </button>
                )}
              </div>
            </div>
          </fieldset>
        </div>
      </div>
      {showDeleteModal && <DeleteAPIKeyModal />}
    </div>
  );
}

export default Company;
