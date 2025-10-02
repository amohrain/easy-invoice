"use client";
import Footer from "@/sections/Footer";
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
