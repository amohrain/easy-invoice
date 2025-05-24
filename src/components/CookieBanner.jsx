"use client";
import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) setShowBanner(true);
    if (consent === "accepted") loadAnalytics();
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setShowBanner(false);
    loadAnalytics();
  };

  const rejectCookies = () => {
    localStorage.setItem("cookieConsent", "rejected");
    setShowBanner(false);
  };

  const loadAnalytics = () => {
    const script = document.createElement("script");
    script.src = "https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"; // Replace with your GA ID
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    gtag("js", new Date());
    gtag("config", "G-XXXXXXX"); // Replace with your GA ID
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 backdrop-blur-sm border-t border-base-100/40 p-4 z-50 shadow-md">
      <div className="max-w-screen-md mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-base-content/50">
          We use cookies to improve your experience and analyze usage. Read our{" "}
          <a href="/privacy-policy" className="link link-hover">
            Privacy Policy
          </a>{" "}
          and our{" "}
          <a href="/cookie-policy" className="link link-hover">
            Cookie Policy
          </a>
        </p>
        <div className="flex gap-2">
          <button
            onClick={acceptCookies}
            className=" btn btn-success rounded-full"
          >
            <Check />
            Accept
          </button>
          <button
            onClick={rejectCookies}
            className="btn btn-error rounded-full"
          >
            <X />
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
