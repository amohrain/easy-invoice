"use client";
import { MenuIcon, X } from "lucide-react";
import React, { useState } from "react";
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
import { PanelLeftCloseIcon, PanelsTopLeftIcon } from "lucide-react";
import { FaPeopleGroup } from "react-icons/fa6";
import { UserButton, useUser } from "@clerk/nextjs";

function Menu() {
  const [showSidebar, setShowSidebar] = useState(false);
  const { user } = useUser();
  const fullName = user?.fullName;

  return (
    <>
      {/* Hamburger button */}
      <div className="fixed top-4 right-4 z-50 md:hidden">
        <button
          className="rounded-full p-2 bg-base-300 shadow"
          onClick={() => setShowSidebar(true)}
        >
          <MenuIcon />
        </button>
      </div>

      {/* Backdrop */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-base-300 z-50 p-4 shadow-lg transform transition-transform duration-300 md:hidden ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close button */}
        <div className="flex justify-between mb-4">
          <div className="flex justify-center gap-3">
            <UserButton />
            <p className="text-lg"> {fullName}</p>
          </div>
          <button onClick={() => setShowSidebar(false)}>
            <X />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex flex-col gap-1">
          <NavButton link="/dashboard" name={"Dashboard"} icon={<BiHome />} />
          <NavButton link="/invoices" name={"Invoices"} icon={<BiDollar />} />
          <NavButton link="/company" name={"Company"} icon={<BsBuilding />} />
          <NavButton
            link="/clients"
            name={"Clients"}
            icon={<FaPeopleGroup />}
          />
          <NavButton link="/billing" name={"Billing"} icon={<PiInvoice />} />
          <NavButton link="/suggestions" name={"Review"} icon={<BiEdit />} />
        </div>
      </div>
    </>
  );
}

export default Menu;
