"use client";
import React, { useEffect } from "react";
import { SignUp } from "@clerk/nextjs";

function SignUpPage() {
  useEffect(() => {
    // Clear local storage on sign-in page load
    localStorage.removeItem("clients");
    localStorage.removeItem("company");
    localStorage.removeItem("companies");
    localStorage.removeItem("templates");
    localStorage.removeItem("onboarded");
  }, []);

  return (
    <div className="flex h-screen items-center justify-center vibe-gradient">
      <SignUp
        routing="hash"
        fallbackRedirectUrl="/post-auth"
        className="self-center"
      />
    </div>
  );
}

export default SignUpPage;
