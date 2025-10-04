import React, { useEffect, useState } from "react";
import { useCompanyStore } from "../store/useCompany";
import {
  Copy,
  CopyCheck,
  ExternalLink,
  Key,
  KeyRound,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

function APIKeyCompany() {
  const { company, setCompany } = useCompanyStore();
  const [copied, setCopied] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleGenerateAPIKey = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/company/api-key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ companyId: company._id }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("API key generated successfully");
        setCompany({ ...company, apiKey: data.apiKey });
      }
      localStorage.removeItem("company");
    } catch (error) {
      console.error("Error generating API key:", error);
      toast.error("Error generating API key");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAPIKey = async () => {
    setLoading(true);
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

      console.log("Delete API Key Response:", data);

      if (data.success) {
        toast.success("API key deleted successfully");
        setCompany({ ...company, apiKey: null });
        setShowDeleteModal(false);
        localStorage.removeItem("company");
      }
    } catch (error) {
      console.error("Error deleting API key:", error);
      toast.error("Error deleting API key");
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  const DeleteAPIKeyModal = () => {
    return (
      <dialog
        id="my_modal_5"
        className="modal backdrop-blur modal-open modal-bottom sm:modal-middle"
      >
        <div className="modal-box">
          <h3 className="font-bold gradient-text text-lg">Delete API Key!</h3>
          <p className="py-4">
            Are you sure you want to delete the API key? This action cannot be
            undone. If you delete the API key, you will need to generate a new
            one to access the API. This will also invalidate any existing API
            keys.
          </p>
          <div className="modal-action gap-2">
            <button
              onClick={handleDeleteAPIKey}
              className="btn btn-error rounded-full"
            >
              {loading && (
                <span className="loading loading-spinner loading-sm"></span>
              )}
              Delete
            </button>
            <button
              onClick={() => setShowDeleteModal(false)}
              className="btn rounded-full"
            >
              Close
            </button>
          </div>
        </div>
      </dialog>
    );
  };

  if (!company?.apiKey)
    return (
      <button onClick={handleGenerateAPIKey} className="btn rounded-full w-fit">
        {loading ? (
          <span className="loading loading-spinner loading-sm"></span>
        ) : (
          <KeyRound size={18} />
        )}
        Generate API Key
      </button>
    );

  return (
    <div className="hidden sm:flex items-center">
      <div className="flex bg-base-100/50 p-4 rounded-2xl gap-2">
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
        <button onClick={() => setShowDeleteModal(true)}>
          <Trash2 className="size-4 self-center hover:cursor-pointer hover:text-error" />
        </button>
        <Link className="self-center" target="_blank" href="/docs">
          <button className="btn rounded-full">
            Docs
            <ExternalLink className="size-4" />
          </button>
        </Link>
      </div>
      {showDeleteModal && <DeleteAPIKeyModal />}
    </div>
  );
}

export default APIKeyCompany;
