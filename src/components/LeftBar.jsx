"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import NavButton from "./NavButton";
import {
  BiCard,
  BiDollar,
  BiEdit,
  BiHome,
  BiNotification,
} from "react-icons/bi";
import { PiInvoice } from "react-icons/pi";
import { BsBuilding } from "react-icons/bs";
import {
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
  PanelsTopLeftIcon,
} from "lucide-react";
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
        className={`hidden sm:flex  flex-col justify-between h-full min-h-screen shadow-lg transition-all duration-300 bg-base-300 py-6 ${
          collapsed ? "w-16" : "w-xs"
        }`}
      >
        {/* Top section */}
        <div className="flex flex-col  px-4">
          {/* Logo */}

          <div className="self-center px-auto mb-4">
            <a href="/dashboard" className="text-2xl font-bold">
              <div className="flex items-center gap-2">
                <img className="size-6 self-center" src={"/Logo.png"} />
                {!collapsed && <span>Vibe Invoice</span>}
              </div>
            </a>
          </div>

          <div className="w-full h-[2px] bg-neutral-content mb-1.5" />

          {/* Navigation */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between">
              <NavButton
                link="/dashboard"
                name={!collapsed && "Dashboard"}
                icon={<BiHome />}
              />
              {!collapsed && (
                <button
                  className="btn btn-circle btn-ghost btn-sm self-center p-1 m-[-4px] rounded-full hover:text-primary hover:bg-base-200 cursor-pointer"
                  onClick={() => setCollapsed((prev) => !prev)}
                >
                  <PanelLeftCloseIcon size={14} />
                </button>
              )}
            </div>
            <NavButton
              link="/invoices"
              name={!collapsed && "Invoices"}
              icon={<BiDollar />}
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
              icon={<PiInvoice />}
            />
            <NavButton
              link="/suggestions"
              name={!collapsed && "Review"}
              icon={<BiEdit />}
            />
          </div>
        </div>
        {/* Collapse button positioned exactly on the right edge */}
        <div className="absolute top-1/2 self-end z-10">
          <button
            onClick={() => setCollapsed((prev) => !prev)}
            className="mr-[-14px] p-2 rounded-full hover:text-primary hover:bg-base-100 cursor-pointer"
          >
            {collapsed && <PanelLeftOpenIcon size={14} />}
          </button>
        </div>

        {/* Bottom section */}
        <div className="px-4">
          {!collapsed && (
            <div className="flex flex-row-reverse justify-center">
              <select
                onChange={(e) => handleCompanyChange(e.target.value)}
                value={company?._id}
                className="select w-fit select-ghost"
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
