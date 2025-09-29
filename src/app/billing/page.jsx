"use client";
import React, { useEffect } from "react";
import LeftBar from "../../components/LeftBar";
import Plans from "../../components/Plans";
import { useUserStore } from "../../store/useUser";

function page() {
  const { user, getCurrentUser } = useUserStore();
  const now = new Date();
  const currentMonth = now.toISOString().slice(0, 7); // 'YYYY-MM'
  const invoiceCount =
    user?.invoiceCountMonth === currentMonth ? user?.invoiceCount : 0 || 0;

  useEffect(() => {
    async function fetchData() {
      await getCurrentUser();
    }
    fetchData();
  }, []);

  return (
    <div className="vibe-dashboard">
      <LeftBar className="" />
      <div className="flex flex-col w-full rounded-xl overflow-y-auto pt-12">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="gradient-text text-4xl text-center font-semibold">
            One-time payment, no commitments
          </h1>
          <Plans where="billing" />
          <div>
            <p className="text-center">
              Current plan: {user?.subscriptionPlan}
            </p>
            <p className="text-center">
              Invoices created this month: {invoiceCount}
            </p>
            {user?.invoice && (
              <p className="text-center">
                <a
                  className="link"
                  href={`${process.env.NEXT_PUBLIC_BASE_URL}/view/${user.invoice}`}
                >
                  Download invoice
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
