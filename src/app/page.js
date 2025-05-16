"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Footer from "@/sections/Footer";
import SEO from "@/components/SEO";

import HowItWorks from "@/sections/HowItWorks";
import Hero from "../sections/Hero";
import ProductShowcase from "../sections/ProductShowcase";
import Demo from "../sections/Demo";
import Pricing from "../sections/Pricing";
import NavigationBar from "../sections/NavigationBar";
import FAQ from "../sections/FAQ";

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
      <Demo />
      <Pricing />
      <FAQ />
      <Footer />
    </>
  );
}
