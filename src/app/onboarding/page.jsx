"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useCompanyStore } from "../../store/useCompany";
import { Save, Upload, UploadCloud, X } from "lucide-react";

export default function Onboarding() {
  const router = useRouter();
  const { user } = useUser();
  const [step, setStep] = useState(1);
  const { logo, setLogo, loading, setLoading, companyData, setCompanyData } =
    useCompanyStore();

  useEffect(() => {
    async function checkIfOnboarded() {
      const response = await fetch("/api/company");
      const data = await response.json();
      const companies = data.data;

      if (companies?.length > 0) router.push("/invoices/create");
    }
    checkIfOnboarded();
  }, []);

  const steps = {
    1: {
      heading: user?.firstName ? `Welcome, ${user?.firstName}!` : "Welcome!",
      subheading: "Tell us a bit about your business.",
      buttonText: "Save",
      style: "generate-button",
      buttonIcon: <Save />,
    },
    2: {
      heading: "Upload your logo",
      subheading: "Add your company logo.",
      buttonText: logo ? "Upload" : "Skip for now",
      style: logo
        ? "generate-button"
        : "btn btn-outline border-dashed rounded-full",
      buttonIcon: logo ? <UploadCloud /> : null,
    },
    3: {
      heading: "You're all set!",
      subheading: "Click below to create your first invoice",
      buttonText: "Go to dashboard",
      style: "generate-button",
      buttonIcon: null,
    },
  };

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
      if (!companyData?.businessName || companyData?.businessName.trim() === "")
        return alert("Company Name is required");
      setStep((prev) => prev + 1);
      return;
    } else if (step === 2) {
      await handleCreateCompany();
      return;
    } else if (step >= 3) {
      router.push("/invoices/create");
    }
  };

  const Heading = () => (
    <>
      <h2 className="gradient-text text-center text-3xl font-bold">
        {steps[step].heading}
      </h2>
      <p className="section-description mt-2 mb-4">{steps[step].subheading}</p>
    </>
  );

  return (
    <div className="min-h-screen w-full vibe-gradient pt-16 p-4">
      {step == 1 && <Heading />}
      <div className="flex flex-col max-w-xl w-full min-h-3xl mx-auto vibe-opacity border border-primary/20 p-6 bg-base rounded-lg shadow-md">
        {step === 1 && (
          <div>
            <fieldset className="rounded-lg">
              <div className="mb-4">
                <label className="fieldset-label block mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  required
                  className="input input-bordered w-full bg-base-100/50"
                  placeholder="Vibe Invoice"
                  value={companyData?.businessName || ""}
                  onChange={(e) =>
                    setCompanyData({
                      businessName: e.target.value,
                    })
                  }
                />
              </div>
              <div className="mb-4">
                <label className="fieldset-label block mb-2">Address</label>
                <textarea
                  className="textarea textarea-bordered w-full h-22 resize-none bg-base-100/50"
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
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="input input-bordered w-full bg-base-100/50"
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
                  className="input input-bordered w-full bg-base-100/50"
                  placeholder="contact@vibeinvoice.com"
                  value={companyData?.businessEmail || ""}
                  onChange={(e) =>
                    setCompanyData({
                      businessEmail: e.target.value,
                    })
                  }
                />
              </div>
            </fieldset>
          </div>
        )}
        {step === 2 && (
          <div className="flex flex-col justify-center">
            <div className="text-center">
              <Heading />
            </div>
            <label
              htmlFor="file-upload"
              className="relative flex flex-col w-xs self-center items-center justify-center border-2 border-dashed border-primary/20 rounded-xl cursor-pointer my-4 p-6 hover:border-primary/40 transition"
            >
              {logo ? (
                <div className="">
                  <img
                    src={URL.createObjectURL(logo)}
                    alt="Preview"
                    className="h-32 w-32 object-contain rounded-md"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setLogo(null);
                    }}
                    className="absolute top-[-12px] right-[-12px] btn btn-circle btn-error btn-xs"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center text-gray-500">
                  <Upload size={32} />
                  <p className="mt-2">Click to upload</p>
                </div>
              )}
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={(e) => setLogo(e.target.files[0])}
                className="hidden"
              />
            </label>
          </div>
        )}
        {step === 3 && (
          <div className="text-center">
            <Heading />
          </div>
        )}
        <button
          className={`self-center mt-6 w-fit text-lg ${steps[step].style}`}
          disabled={loading}
          onClick={handleNext}
        >
          {loading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            steps[step].buttonIcon
          )}
          {steps[step].buttonText}
        </button>
      </div>
    </div>
  );
}
