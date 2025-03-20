"use client";
import React from "react";

import {
  UserButton,
  useUser,
  useClerk,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import Link from "next/link";

function Nav() {
  const { user } = useUser();
  const fullName = user?.fullName;
  return (
    <div className="px-5 navbar bg-base-200 shadow-sm">
      <div className="flex-1">
        <a href="/dashboard" className="text-2xl font-bold">
          <div className="flex gap-2 items-center">EasyVoice</div>
        </a>
      </div>
      <div className="flex flex-row dropdown dropdown-end gap-2.5">
        <SignedIn>
          <p className="sm:block hidden text-lg">Hi, {fullName}</p>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <button className="btn btn-outline">
            <Link href={"/sign-in"}>Sign in</Link>
          </button>
          <button className="sm:block hidden btn btn-primary">
            <Link href={"/sign-up"}>Get started</Link>
          </button>
        </SignedOut>
      </div>
    </div>
  );
}

export default Nav;
