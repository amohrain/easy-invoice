"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import NavButton from "./NavButton";
import { BiCard, BiHome } from "react-icons/bi";
import { PiInvoice } from "react-icons/pi";
import { BsBuilding } from "react-icons/bs";
import { PanelLeftCloseIcon, PanelsTopLeftIcon } from "lucide-react";
import { FaPeopleGroup } from "react-icons/fa6";
import { useCompanyStore } from "@/store/useCompany";
import Menu from "./Menu";

function LeftBar() {
  const { user } = useUser();
  const fullName = user?.fullName;
  const { company, companies, getCompanies, changeCompany } = useCompanyStore();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setCollapsed(true);
    }
    if (window.innerWidth < 640) {
      setMobileMenu(true);
    }
  }, []);

  useEffect(() => {
    getCompanies();
  }, [getCompanies]);

  const handleCompanyChange = async (companyId) => {
    await changeCompany(companyId);
  };

  if (mobileMenu) return <Menu />;

  return (
    <>
      <Menu />
      <div
        className={`hidden sm:flex flex-col  h-full min-h-screen shadow-lg transition-all duration-300 bg-base-300 py-6 ${
          collapsed ? "w-16" : "w-xs"
        }`}
      >
        {/* Toggle button */}
        <div className="flex justify-end px-4"></div>

        {/* Top section */}
        <div className="flex flex-col px-4">
          {/* Logo */}

          <div className="px-2 mb-4">
            <a href="/dashboard" className="text-2xl font-bold">
              <div className="flex items-center gap-2">
                <span>{collapsed ? "VI" : "Vibe Invoice"}</span>
              </div>
            </a>
          </div>

          <div className="w-full h-[2px] bg-neutral-content mb-1.5" />

          {/* Navigation */}
          <div className="flex flex-col gap-1">
            <NavButton
              link="/dashboard"
              name={!collapsed && "Dashboard"}
              icon={<BiHome />}
            />
            <NavButton
              link="/invoices"
              name={!collapsed && "Invoices"}
              icon={<PiInvoice />}
            />
            <NavButton
              link="/company"
              name={!collapsed && "Company"}
              icon={<BsBuilding />}
            />
            <NavButton
              link="/clients"
              name={!collapsed && "Clients"}
              icon={<FaPeopleGroup />}
            />
            <NavButton
              link="/billing"
              name={!collapsed && "Billing"}
              icon={<BiCard />}
            />
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-auto px-4">
          {collapsed && (
            <button
              onClick={() => setCollapsed((prev) => !prev)}
              className="btn btn-sm btn-ghost"
            >
              <PanelLeftCloseIcon size={20} />
            </button>
          )}
          {!collapsed && (
            <div className="flex flex-row-reverse items-center">
              <button
                onClick={() => setCollapsed((prev) => !prev)}
                className="btn self-center btn-sm btn-ghost"
              >
                <PanelLeftCloseIcon className="" size={20} />
              </button>
              <select
                onChange={(e) => handleCompanyChange(e.target.value)}
                value={company?._id}
                className="select w-full self-center select-ghost"
              >
                {companies?.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.businessName}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex justify-center gap-3">
            <SignedIn>
              {!collapsed && <p className="text-lg"> {fullName}</p>}
              <UserButton />
            </SignedIn>
            <SignedOut>
              <Link href="/sign-in" className="btn btn-outline btn-sm">
                {!collapsed ? "Sign In" : "→"}
              </Link>
              {!collapsed && (
                <Link href="/sign-up" className="btn btn-primary btn-sm">
                  Get Started
                </Link>
              )}
            </SignedOut>
          </div>
        </div>
      </div>
    </>
  );
}

export default LeftBar;
