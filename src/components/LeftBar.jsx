import React from "react";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import NavButton from "./NavButton";
import { BiHome } from "react-icons/bi";
import { PiInvoice } from "react-icons/pi";
import { MdOutlineRoomPreferences } from "react-icons/md";
import { BsBuilding } from "react-icons/bs";
import { FcTemplate } from "react-icons/fc";
import { Plus } from "lucide-react";

function LeftBar() {
  const { user } = useUser();
  const fullName = user?.fullName;

  return (
    <div className="flex flex-col h-full w-xs py-6 justify-between bg-base-300 min-h-screen shadow-lg">
      {/* Logo and Navigation Section */}
      <div className="flex flex-col px-4 w-full">
        {/* Logo/Brand */}
        <div className="px-2 mb-4">
          <a
            href="/dashboard"
            className="text-2xl font-bold hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center gap-2">
              {/* <div className="mask mask-squircle bg-primary w-10 h-10 flex items-center justify-center text-white font-bold">
                EV
              </div> */}
              <span>VibeInv</span>
            </div>
          </a>
        </div>
        {/* Horizontal line */}
        <div className="w-full h-[2px] bg-neutral-content mb-1.5" />

        {/* Navigation Menu - with visual indicators */}
        <div className="flex flex-col">
          {/* <div className="text-xs font-semibold text-base-content/60 px-2 mb-1">
            MAIN MENU
          </div> */}
          <NavButton link="/dashboard" name="Dashboard" icon={<BiHome />} />
          <NavButton link="/invoices" name="Invoices" icon={<PiInvoice />} />
          <NavButton
            link="/preferences"
            name="Preferences"
            icon={<MdOutlineRoomPreferences />}
          />
          <NavButton link="/company" name="Company" icon={<BsBuilding />} />
          <NavButton link="/templates" name="Templates" icon={<FcTemplate />} />
        </div>
      </div>

      {/* User Profile Section */}
      <div className="flex px-4 mt-auto gap-3">
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
