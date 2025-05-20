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

export default function Home() {
  return (
    <>
      <SEO
        title="Vibe Invoice - Create and share invoices in seconds"
        description="Create stunning invoices in seconds. Type a prompt to generate invoice, share with customers and get paid faster!"
        image="https://vibeinvoice.com/og-image.jpg"
        url="https://vibeinvoice.com"
      />
      <NavigationBar />
      <Hero />
      <ProductShowcase />
      <HowItWorks />
      <Video />
      <Pricing />
      <FAQ />
      <Footer />
    </>
  );
}
