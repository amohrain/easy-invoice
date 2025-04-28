"use client";
import { useEffect } from "react";
import { useRouter } from "next/router";

export function useUnsavedChanges(unsaved) {
  const router = useRouter();

  useEffect(() => {
    const handleWindowBeforeUnload = (e) => {
      if (unsaved) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    const handleRouteChangeStart = (url) => {
      if (
        unsaved &&
        !confirm("You have unsaved changes. Are you sure you want to leave?")
      ) {
        throw "Route change aborted.";
      }
    };

    window.addEventListener("beforeunload", handleWindowBeforeUnload);
    router.events.on("routeChangeStart", handleRouteChangeStart);

    return () => {
      window.removeEventListener("beforeunload", handleWindowBeforeUnload);
      router.events.off("routeChangeStart", handleRouteChangeStart);
    };
  }, [unsaved, router]);
}
