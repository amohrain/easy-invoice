import React, { useEffect, useState } from "react";
import { useCompanyStore } from "../store/useCompany";
import { usePathname, useRouter } from "next/navigation";
import { Copy, CopyCheck, ExternalLink, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { Loading } from "./Loading";

function CompanyForm() {
  const currentPath = usePathname();
  const router = useRouter();
  const {
    loading,
    setLoading,
    company,
    setCompany,
    companyData,
    setCompanyData,
    getAndSetCompaniesData,
    updateCompany,
    logo,
    setLogo,
  } = useCompanyStore();
  const [copied, setCopied] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  useEffect(() => {
    if (currentPath !== "/company") return;

    console.log("Fetching company data for current path:", currentPath);
    const fetchCompanies = async () => {
      await getAndSetCompaniesData();
    };
    fetchCompanies();
  }, [updateCompany]);

  useEffect(() => {
    if (companyData?.currency !== "INR") {
      console.log(
        "Currency changed to non-INR, resetting UPI ID and autoAddUPI"
      );
      setCompanyData({
        ...companyData,
        upiId: "",
        autoAddUPI: false,
      });
    }
  }, [companyData?.currency]);

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
      router.push("/company");
      if (!response.ok) toast.success("Company created successfully");
    } catch (error) {
      console.error("Error creating company:", error);
      toast.error("Error creating company");
    } finally {
      setLoading(false);
    }
  };

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

  const handleSubmit = () => {
    if (currentPath === "/company") {
      handleUpdateCompany();
    } else {
      handleCreateCompany();
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="">
      <fieldset className="fieldset bg-base-100 shadow p-4 rounded-lg">
        {/* <legend className="text-lg font-medium">Company Information</legend> */}

        {/* Two-column layout for form fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* Left Column */}
          <div>
            <div className="mb-4 h-28">
              <label className="fieldset-label block mb-2">Company Logo</label>
              <div className="flex justify-center mb-2">
                {company?.businessLogo && !logo && (
                  <img
                    src={company?.businessLogo}
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
              <label className="fieldset-label block mb-2">Company Name</label>
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
              <label className="fieldset-label block mb-2">Phone Number</label>
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
            <div className="mb-4">
              <label className="fieldset-label block mb-2">
                QR Code Description
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Please scan the QR code to pay"
                value={companyData?.qrText || ""}
                onChange={(e) =>
                  setCompanyData({
                    qrText: e.target.value,
                  })
                }
              />
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
            {companyData?.currency === "INR" && (
              <div className="mb-4">
                <div className="flex justify-between">
                  <label className="fieldset-label block mb-2">
                    UPI ID (India Only)
                  </label>
                  <div className="label">
                    Automatically add QR
                    <input
                      type="checkbox"
                      defaultChecked={companyData?.autoAddUPI || false}
                      value={companyData?.autoAddUPI}
                      onChange={(e) =>
                        setCompanyData({
                          autoAddUPI: e.target.checked,
                        })
                      }
                      className="checkbox checkbox-xs"
                    />
                  </div>
                </div>
                <input
                  type="url"
                  className="input input-bordered w-full"
                  placeholder="abc@upi"
                  value={companyData?.upiId || ""}
                  onChange={(e) =>
                    setCompanyData({
                      upiId: e.target.value,
                    })
                  }
                />
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          {currentPath.includes("/company") && (
            <button
              className="btn self-center btn-primary w-full md:w-fit"
              onClick={handleSubmit}
            >
              {currentPath === "/company"
                ? "Update Company Information"
                : "Create Company"}
            </button>
          )}

          {currentPath === "/company" && (
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
          )}
        </div>
      </fieldset>
      {showDeleteModal && <DeleteAPIKeyModal />}
    </div>
  );
}

export default CompanyForm;
