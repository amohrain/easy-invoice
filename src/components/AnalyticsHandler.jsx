"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import posthog from "posthog-js";

export default function AnalyticsHandler() {
  const pathname = usePathname();

  useEffect(() => {
    // Define which pages you want to track
    const trackedRoutes = ["/dashboard", "/pricing", "/signup"];

    if (trackedRoutes.includes(pathname)) {
      posthog.capture("$pageview", { path: pathname });
    }
  }, [pathname]);

  return null; // no UI, just side-effect
}
