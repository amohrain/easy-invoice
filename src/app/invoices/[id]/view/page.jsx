"use client";
import { useUser } from "@clerk/nextjs";
import React from "react";

function InvoiceViewPage() {
  const { user } = useUser();
  if (!user) {
    return (
      <div className="flex w-full h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }
  return <div>InvoiceViewPage</div>;
}

export default InvoiceViewPage;
