"use client";
import React from "react";
import Link from "next/link";

function Nav() {
  return (
    <div className="p-5 rounded-full navbar bg-base-200 shadow-sm">
      <div className="flex-1">
        <a href="/dashboard" className="text-2xl font-bold">
          <div className="flex gap-2 items-center">VibeInvoice</div>
        </a>
      </div>
      <div className="flex flex-row dropdown dropdown-end gap-2.5">
        <button className="btn btn-outline">
          <Link href={"/sign-in"}>Sign in</Link>
        </button>
        <button className="sm:block hidden btn btn-primary">
          <Link href={"/sign-up"}>Get started</Link>
        </button>
      </div>
    </div>
  );
}

export default Nav;
