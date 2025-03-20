"use client";

import { useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Onboarding() {
  const router = useRouter();
  const { user } = useUser();
  const { user: clerkUser } = useClerk();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: user?.firstName || "",
    position: "" || "",
    industry: "",
  });

  const handleNext = async () => {
    console.log("User:", user);
    if (step === 2) {
      try {
        // await clerkUser.update({
        //   firstName: formData.name,
        // });

        // Call an API route to update publicMetadata
        await fetch("/api/users/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: user.fullName,
            email: user.emailAddresses[0].emailAddress,
            position: formData.position,
            industry: formData.industry,
          }),
        });

        setStep(step + 1);
      } catch (error) {
        console.error("Error updating user:", error);
      }
    } else if (step === 3) {
      router.push("/dashboard");
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-24 p-6 bg-base border rounded-lg shadow-md">
      {step === 1 && (
        <div>
          <h2 className="text-2xl font-bold">Welcome, {user?.firstName}!</h2>
          <p className="mt-2">Let's get you set up.</p>
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
