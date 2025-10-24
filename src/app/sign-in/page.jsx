"use client";
import React, { useEffect } from "react";
import { SignIn } from "@clerk/nextjs";

function SignInPage() {
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
      <SignIn
        routing="hash"
        fallbackRedirectUrl="/post-auth"
        className="self-center"
      />
    </div>
  );
}

export default SignInPage;
