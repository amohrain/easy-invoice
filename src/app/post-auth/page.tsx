"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PostAuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const onboarded = localStorage.getItem("onboarded");
        if (onboarded) {
          router.replace("/invoices/create");
          return;
        }
        const res = await fetch("/api/company");
        if (!res.ok) {
          router.replace("/onboarding");
        } else {
          localStorage.setItem("onboarded", "true");
          router.replace("/invoices/create");
        }
        // Optionally check user data for roles, etc.
      } catch (err) {
        router.replace("/onboarding");
        console.log(err);
      }
    };

    checkUser();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen vibe-gradient">
      <p className="gradient-text text-4xl font-semibold">
        We are getting your dashboard ready.
      </p>
    </div>
  );
}
