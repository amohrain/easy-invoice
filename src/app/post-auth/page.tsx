"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PostAuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const something = localStorage.getItem("something");
        const res = await fetch("/api/company");
        if (!res.ok) {
          router.replace("/onboarding");
        } else {
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

  return <p>Redirecting...</p>;
}
