import React from "react";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";

function LeftBar() {
  const { user } = useUser();
  const fullName = user?.fullName;
  return (
    <div className="flex flex-col py-4 m-4 items-center justify-between rounded-xl bg-base-300">
      <div className="flex flex-col px-10 py-2 gap-2">
        <div className="flex-1">
          <a href="/dashboard" className="text-2xl font-bold">
            <div className="flex gap-2 text-center">EasyVoice</div>
          </a>
        </div>
        <Link href="/" className="">
          <button className="btn btn-primary w-full">Create new</button>
        </Link>
        <Link href="/" className="">
          <button className="btn btn-primary w-full">Invoice Database</button>
        </Link>
        <button className="btn btn-primary">Your Company</button>
        <button className="btn btn-primary">Manage Templates</button>
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

export default LeftBar;
