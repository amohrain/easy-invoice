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
  Building,
  House,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
  PanelsTopLeftIcon,
  ReceiptText,
  SquarePen,
  Users,
  Wallet,
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
        className={`hidden sm:flex max-w-[240px] rounded-xl flex-col justify-between shadow-lg transition-all duration-300 vibe-opacity py-5 ${
          collapsed ? "w-16" : "w-full"
        }`}
      >
        {/* Top section */}
        <div className="flex flex-col px-4">
          {/* Logo */}

          <div className="ml-2 mb-4">
            <a href="/dashboard" className="font-bold">
              <div className="flex items-center gap-2">
                <img className="size-6 self-center" src={"/Logo.png"} />
                {!collapsed && (
                  <span className="text-center border text-3xl font-bold gradient-text">
                    Vibe Invoice
                  </span>
                )}
              </div>
            </a>
          </div>

          {/* <div className="w-full h-[2px] bg-neutral-content mb-1.5" /> */}

          {/* Navigation */}
          <div className="flex flex-col">
            <NavButton
              link="/dashboard"
              name={!collapsed && "Dashboard"}
              icon={<House size={22} />}
            />
            {/* {!collapsed && (
                <button
                  className="btn btn-circle btn-ghost btn-sm self-center p-1 m-[-4px] rounded-full hover:text-primary hover:bg-base-200 cursor-pointer"
                  onClick={() => setCollapsed((prev) => !prev)}
                >
                  <PanelLeftCloseIcon size={14} />
                </button>
              )} */}
            <NavButton
              link="/invoices"
              name={!collapsed && "Invoices"}
              icon={<ReceiptText size={22} />}
            />
            <NavButton
              link="/company"
              name={!collapsed && "Company"}
              icon={<Building size={22} />}
            />
            <NavButton
              link="/clients"
              name={!collapsed && "Clients"}
              icon={<Users size={22} />}
            />
            <NavButton
              link="/billing"
              name={!collapsed && "Billing"}
              icon={<Wallet size={22} />}
            />
            <NavButton
              link="/suggestions"
              name={!collapsed && "Review"}
              icon={<SquarePen size={22} />}
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
        <div className="">
          {!collapsed && (
            <div className="flex flex-row w-full justify-center items-center">
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
