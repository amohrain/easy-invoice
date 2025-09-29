import React from "react";
import { SignIn } from "@clerk/nextjs";

function SignInPage() {
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
