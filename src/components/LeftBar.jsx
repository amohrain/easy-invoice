import React, { useEffect } from "react";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import NavButton from "./NavButton";
import { BiCard, BiHome } from "react-icons/bi";
import { PiInvoice } from "react-icons/pi";
import { MdOutlineRoomPreferences } from "react-icons/md";
import { BsBuilding } from "react-icons/bs";
import { PanelsTopLeftIcon, Plus } from "lucide-react";
import { useCompanyStore } from "@/store/useCompany";
import { TbUserShield } from "react-icons/tb";
import { FaPeopleGroup, FaWpforms } from "react-icons/fa6";

function LeftBar() {
  const { user } = useUser();
  const fullName = user?.fullName;

  const { company, companies, getCompanies, changeCompany } = useCompanyStore();

  useEffect(() => {
    async function fetchCompanies() {
      await getCompanies();
    }
    fetchCompanies();
    console.log("Company fetched: ", company);
  }, [getCompanies]);

  const handleCompanyChange = async (companyId) => {
    await changeCompany(companyId);
  };

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
              <span>Vibe Invoice</span>
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
          <NavButton link="/company" name="Company" icon={<BsBuilding />} />
          <NavButton link="/clients" name="Clients" icon={<FaPeopleGroup />} />
          {/* <NavButton link="/templates" name="Templates" icon={<FaWpforms />} /> */}
          <NavButton link="/billing" name="Billing" icon={<BiCard />} />
        </div>
      </div>

      {/* User Profile Section */}
      <div className="flex flex-col items-center">
        <select
          onChange={(e) => handleCompanyChange(e.target.value)}
          value={company._id}
          className="select w-auto select-ghost mx-2"
        >
          {companies?.map((company) => (
            <option key={company._id} value={company._id}>
              {company.businessName}
            </option>
          ))}
        </select>
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
    </div>
  );
}

export default LeftBar;
