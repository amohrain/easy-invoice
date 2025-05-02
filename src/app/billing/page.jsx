"use client";
import React, { useEffect } from "react";
import LeftBar from "../../components/LeftBar";
import Plans from "../../components/Plans";
import { useUserStore } from "../../store/useUser";

function page() {
  const { user, getCurrentUser } = useUserStore();

  useEffect(() => {
    async function fetchData() {
      await getCurrentUser();
    }
    fetchData();
  }, []);

  return (
    <div className="flex w-full flex-row h-screen">
      <LeftBar className="" />
      <div className="flex flex-col w-full h-screen bg-base-100 overflow-y-auto p-12">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-3xl text-center font-semibold">
            One-time payment, no commitments
          </h1>
          <Plans where="billing" />
          <div>
            <p className="text-center">
              Current plan: {user?.subscriptionPlan}
            </p>
            <p className="text-center">Invoices created this month: {0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
