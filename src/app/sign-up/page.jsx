import React from "react";
import { SignUp } from "@clerk/nextjs";

function SignUpPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <SignUp
        routing="hash"
        fallbackRedirectUrl="/post-auth"
        className="self-center"
      />
    </div>
  );
}

export default SignUpPage;
