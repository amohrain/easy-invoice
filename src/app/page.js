"use client";
// import BookmarkPreview from "@/components/BookmarkPreview";
import Nav from "@/components/Nav";
import TypingPlaceholder from "@/components/TypingPlaceholder";
import PricingPlan from "@/components/PricingPlan";
import { useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import Plans from "@/components/Plans";

export default function Home() {
  const [text, setText] = useState("");
  return (
    <>
      <SEO
        title="Bulkmark - PDF Bookmarks in One Click"
        description="Create hundreds of PDF bookmarks instantly with Bulkmark. Save time and boost efficiency!"
        image="https://bulkmark.in/og-image.jpg"
        url="https://bulkmark.in"
      />
      <Nav />
      <div
        className="hero min-h-screen"
        style={{
          backgroundImage:
            "url(https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp)",
        }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content text-neutral-content text-center">
          <div className="w-full">
            <h1 className="mb-5 text-5xl sm:text-6xl font-bold">
              Create invoices in seconds
            </h1>
            <p className="mb-5 sm:text-2xl">
              Hundreds of PDF bookmarks in seconds
            </p>
            <button className="btn btn-primary sm:btn-xl">
              <Link href={"/sign-up"}>Get Started with Bulkmark</Link>
            </button>
          </div>
        </div>
      </div>
      <div className="min-h-screen flex flex-col items-center justify-center gap-12 py-16 px-8">
        <h2 className="text-center text-4xl sm:text-6xl font-bold">
          Paste whatever you have in the prompt{" "}
        </h2>
        <div className="w-full max-w-4xl p-4 flex flex-col justify-center border border-gray-100 shadow-base shadow-2xl rounded-2xl">
          <TypingPlaceholder
            isUsingAI={true}
            text={""}
            setText={setText}
            disabled="true"
          />
          <div className="flex flex-row">
            <div className="flex flex-row w-full gap-2"></div>
            <button className="btn btn-neutral btn-circle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="30"
                height="30"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path
                  d="M9 4h6a1 1 0 0 1 1 1v14l-4-2-4 2V5a1 1 0 0 1 1-1z"
                  fill="currentColor"
                />

                <path
                  d="M18 6h.01M20 4h.01M16 4h.01M19 9h.01M14 7h.01"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className="min-h-screen w-full flex flex-col items-center justify-center gap-12 py-16 px-8">
        <h2 className="text-center text-4xl sm:text-6xl font-bold">
          Automatically creates hierarcy structure
        </h2>
        {/* <BookmarkPreview /> */}
      </div>
      <div className="min-h-screen w-full flex flex-col items-center justify-center gap-12 py-16 px-8">
        <h2 className="text-center text-4xl sm:text-6xl font-bold">
          One-time payment, no commitments
        </h2>
        <Plans where="home" />
        <h3 className="text-xl">
          All plans come with 30 day risk-free gurantee
        </h3>
      </div>
      <Footer />
    </>
  );
}
