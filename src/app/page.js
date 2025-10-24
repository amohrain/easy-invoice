"use client";
import Footer from "@/sections/Footer";
import Hero from "../sections/Hero";
import ProductShowcase from "../sections/ProductShowcase";
import Pricing from "../sections/Pricing";
import NavigationBar from "../sections/NavigationBar";
import FAQ from "../sections/FAQ";
import Video from "../sections/Video";
import HowItWorksCards from "../sections/HowItWorksCards";

export default function Home() {
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
