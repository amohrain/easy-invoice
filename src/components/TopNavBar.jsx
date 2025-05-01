import React, { useEffect, useState } from "react";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { BiCard, BiHome } from "react-icons/bi";
import { PiInvoice } from "react-icons/pi";
import { BsBuilding } from "react-icons/bs";
import { FaPeopleGroup } from "react-icons/fa6";
import { MenuIcon, XIcon } from "lucide-react";
import { useCompanyStore } from "@/store/useCompany";

const TopNavBar = () => {
  const { user } = useUser();
  const fullName = user?.fullName;
  const { company, companies, getCompanies, changeCompany } = useCompanyStore();

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    getCompanies();
  }, [getCompanies]);

  const handleCompanyChange = async (companyId) => {
    await changeCompany(companyId);
  };

  const NavLinks = () => (
    <>
      <Link href="/dashboard" className="btn btn-ghost">
        <BiHome className="mr-2" />
        <span>Dashboard</span>
      </Link>
      <Link href="/invoices" className="btn btn-ghost">
        <PiInvoice className="mr-2" />
        <span>Invoices</span>
      </Link>
      <Link href="/company" className="btn btn-ghost">
        <BsBuilding className="mr-2" />
        <span>Company</span>
      </Link>
      <Link href="/clients" className="btn btn-ghost">
        <FaPeopleGroup className="mr-2" />
        <span>Clients</span>
      </Link>
      <Link href="/billing" className="btn btn-ghost">
        <BiCard className="mr-2" />
        <span>Billing</span>
      </Link>
    </>
  );

  return (
    <nav className="w-full bg-base-300 shadow-md px-4 py-2 flex items-center justify-between">
      {/* Brand */}
      <div className="flex items-center gap-2">
        <button
          className="md:hidden btn btn-square btn-ghost"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <XIcon /> : <MenuIcon />}
        </button>
        <Link href="/dashboard" className="text-xl font-bold">
          Vibe Invoice
        </Link>
      </div>

      {/* Desktop Nav */}
      <div className="hidden md:flex gap-2">{<NavLinks />}</div>

      {/* Right Side */}
      <div className="flex items-center gap-2">
        {companies.length > 0 && (
          <select
            onChange={(e) => handleCompanyChange(e.target.value)}
            value={company?._id}
            className="select select-sm select-bordered hidden sm:block"
          >
            {companies.map((c) => (
              <option key={c._id} value={c._id}>
                {c.businessName}
              </option>
            ))}
          </select>
        )}
        <SignedIn>
          <span className="hidden sm:block">Hi, {fullName}</span>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <Link href="/sign-in" className="btn btn-sm btn-outline">
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="btn btn-sm btn-primary hidden sm:inline-flex"
          >
            Get Started
          </Link>
        </SignedOut>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-base-300 shadow-lg p-4 flex flex-col gap-2 md:hidden z-50">
          {<NavLinks />}
        </div>
      )}
    </nav>
  );
};

export default TopNavBar;
