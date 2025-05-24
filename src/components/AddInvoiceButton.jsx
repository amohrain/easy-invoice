"use client";
import { Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

function AddInvoiceButton() {
  const currentPath = usePathname();

  const acceptedRoutes = [
    "/dashboard",
    "/invoices",
    "/company",
    "/clients",
    "/suggestions",
  ];

  if (!acceptedRoutes.includes(currentPath)) {
    return null; // Don't show the button if the current path is not in the accepted routes
  }

  return (
    <div className="fixed right-5 bottom-5">
      <Link href={"/invoices/create"}>
        <button className="btn btn-circle btn-primary">
          <Plus />
        </button>
      </Link>
    </div>
  );
}

export default AddInvoiceButton;
