"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Onboarding() {
  const router = useRouter();
  const { user } = useUser();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: user?.firstName || "",
    position: "" || "",
    industry: "",
  });
  const [companyData, setCompanyData] = useState({
    businessName: "",
    businessAddress: "",
    businessLogo: "",
    businessEmail: "",
    businessPhone: "",
  });

  const handleNext = async () => {
    if (step === 2) {
      try {
        // Call an API route to update publicMetadata
        const response = await fetch("/api/users/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: user.fullName,
            email: user.emailAddresses[0].emailAddress,
            position: formData.position,
            industry: formData.industry,
          }),
        });
        if (!response.ok) {
          throw new Error("Failed to update user data");
        }
        setStep((prev) => prev + 1);
      } catch (error) {
        console.error("Error creating user:", error);
      }
    } else if (step === 3) {
      try {
        const response = await fetch("/api/company", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(companyData),
        });
        if (!response.ok) {
          throw new Error("Failed to create company");
        }
        setStep((prev) => prev + 1);
      } catch (error) {
        console.error("Error creating company:", error);
      }
    } else if (step === 4) {
      router.push("/dashboard");
    } else setStep((prev) => prev + 1);
  };

  return (
    <div className="max-w-md mx-auto mt-24 p-6 bg-base border rounded-lg shadow-md">
      {step === 1 && (
        <div>
          <h2 className="text-2xl font-bold">Welcome, {user?.firstName}!</h2>
          <p className="mt-2">Let's get you set up with Easy Invoice.</p>
        </div>
      )}
      {step === 2 && (
        <div>
          <h2 className="text-xl font-bold">What describes you the best</h2>
          <input
            type="text"
            placeholder="Your Position"
            className="input input-bordered w-full mt-4"
            value={formData.position}
            onChange={(e) =>
              setFormData({ ...formData, position: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Your Industry"
            className="input input-bordered w-full mt-2"
            value={formData.industry}
            onChange={(e) =>
              setFormData({ ...formData, industry: e.target.value })
            }
          />
        </div>
      )}
      {step === 3 && (
        <div>
          <h2 className="text-2xl font-bold">Please describe your company!</h2>
          <p className="mt-2">
            This will help us tailor the experience to your needs.
          </p>
          <input
            type="text"
            placeholder="Your Company Name"
            className="input input-bordered w-full mt-4"
            value={companyData.name}
            onChange={(e) =>
              setCompanyData({ ...companyData, businessName: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Your Company Email"
            className="input input-bordered w-full mt-2"
            value={companyData.industry}
            onChange={(e) =>
              setCompanyData({ ...companyData, businessEmail: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Your Company Address"
            className="input input-bordered w-full mt-2"
            value={companyData.businessAddress}
            onChange={(e) =>
              setCompanyData({
                ...companyData,
                businessAddress: e.target.value,
              })
            }
          />
          <input
            type="text"
            placeholder="Your Company Phone"
            className="input input-bordered w-full mt-2"
            value={companyData.businessPhone}
            onChange={(e) =>
              setCompanyData({
                ...companyData,
                businessPhone: e.target.value,
              })
            }
          />
          <input
            type="text"
            placeholder="Your Company Logo URL. Leave empty if you don't have one"
            className="input input-bordered w-full mt-2"
            value={companyData.businessLogo}
            onChange={(e) =>
              setCompanyData({
                ...companyData,
                businessLogo: e.target.value,
              })
            }
          />
        </div>
      )}
      {step === 4 && (
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
