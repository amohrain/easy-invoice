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

  // check exact matches OR routes that start with "/invoices/"
  const isAccepted =
    acceptedRoutes.includes(currentPath) ||
    (currentPath.startsWith("/invoices/") && !currentPath.includes("/create"));

  if (!isAccepted) {
    return null;
  }

  return (
    <div className="fixed flex justify-end right-5 bottom-5">
      <Link href={"/invoices/create"}>
        <button className=" generate-button btn-circle">
          <Plus size={24} />
          {/* <span className="hidden group-hover:block text-lg">Create</span> */}
        </button>
      </Link>
    </div>
  );
}

export default AddInvoiceButton;
