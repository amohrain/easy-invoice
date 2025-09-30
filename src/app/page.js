"use client";
import Footer from "@/sections/Footer";
import SEO from "@/components/SEO";

import HowItWorks from "@/sections/HowItWorks";
import Hero from "../sections/Hero";
import ProductShowcase from "../sections/ProductShowcase";
import Pricing from "../sections/Pricing";
import NavigationBar from "../sections/NavigationBar";
import FAQ from "../sections/FAQ";
import Video from "../sections/Video";
import HowItWorksCards from "../sections/HowItWorksCards";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    // Clear local storage on sign-in page load
    localStorage.removeItem("clients");
    localStorage.removeItem("company");
    localStorage.removeItem("companies");
    localStorage.removeItem("templates");
    localStorage.removeItem("onboarded");
  }, []);

  return (
    <div className="vibe-gradient">
      <SEO
        title="Vibe Invoice - Create and share invoices in seconds"
        description="Create stunning invoices in seconds. Type a prompt to generate invoice, share with customers and get paid faster!"
        image="https://vibeinvoice.com/og-image.png"
        url="https://vibeinvoice.com"
      />
      <NavigationBar />
      <Hero />
      <Video />
      <HowItWorksCards />
      <ProductShowcase />
      <Pricing />
      <FAQ />
      <Footer />
    </div>
  );
}
