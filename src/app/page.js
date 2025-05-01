"use client";
// import BookmarkPreview from "@/components/BookmarkPreview";
import Nav from "@/components/Nav";
import TypingPlaceholder from "@/components/TypingPlaceholder";
import PricingPlan from "@/components/PricingPlan";
import { useEffect, useState } from "react";
import Link from "next/link";
import Footer from "@/Sections/Footer";
import SEO from "@/components/SEO";
import Plans from "@/components/Plans";
import { useClientStore } from "../store/useClient";
import { useInvoiceStore } from "../store/useInvoice";
import { InvoicePreview } from "../components/InvoicePreview";
import { templates } from "../lib/templatesData";
import { useTemplateStore } from "../store/useTemplate";
import { sampleCompany } from "../constants/sampleCompany";
// import { useCompanyStore } from "../store/useCompany";
import { clients } from "../constants/clients";
import { dummyInvoice } from "../lib/dummyInvoice";
import HowItWorks from "../Sections/HowItWorks";
import { handleInvoiceGenerate } from "../lib/openai";
import { calculateInvoice } from "../lib/calculate";
import { Loading } from "../components/Loading";

export default function Home() {
  const { setTemplate } = useTemplateStore();

  const [loading, setLoading] = useState();
  const { invoice, setInvoice } = useInvoiceStore();

  const [text, setText] = useState("");
  const [step, setStep] = useState(1);
  const { clientId, setSampleClients } = useClientStore();
  // const { sampleCompany } = useCompanyStore();

  useEffect(() => {
    setTemplate(templates[0]);
    setSampleClients();
    // sampleCompany();
  }, []);

  const handleGenerate = async () => {
    try {
      setLoading(true);

      const invoiceInfo = {
        issuedAt: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        invoiceNumber: "INV-001",
        dueDate: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      };

      const invoice = await handleInvoiceGenerate(text);
      // const invoice = dummyInvoice;
      const updatedInvoice = calculateInvoice(invoice);
      const clientInfo = clients.find((client) => client._id === clientId);

      setInvoice({
        ...updatedInvoice,
        ...clientInfo,
        ...sampleCompany,
        ...invoiceInfo,
      });
      setLoading(false);
      setStep(2);
    } catch (error) {
      console.log("Error generating invoice: ", error);
    }
  };

  const PreviewModal = () => {
    return (
      <div className="fixed inset-0 bg-base-100 flex items-center justify-center z-50 overflow-y-auto">
        <InvoicePreview setStep={setStep} preview={true} editable={true} />
      </div>
    );
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <SEO
        title="Bulkmark - PDF Bookmarks in One Click"
        description="Create hundreds of PDF bookmarks instantly with Bulkmark. Save time and boost efficiency!"
        image="https://bulkmark.in/og-image.jpg"
        url="https://bulkmark.in"
      />

      <nav className="bg-gradient-to-r sm:px-12 from-primary/35 via-base-100 to-primary/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="text-2xl font-bold">Vibe Invoice</div>

          {/* Navigation Links (hidden on mobile) */}
          <div className="hidden md:flex gap-6 text-base font-medium">
            <a href="#how-it-works" className="hover:text-primary">
              How it works
            </a>
            <a href="#interactive-demo" className="hover:text-primary">
              Interactive Demo
            </a>
            <a href="#pricing" className="hover:text-primary">
              Pricing
            </a>
            <a href="#faq" className="hover:text-primary">
              FAQs
            </a>
          </div>

          {/* Call to Action */}
          <div className="hidden md:flex gap-2">
            <Link href={"/sign-in"}>
              <button className="btn btn-outline rounded-full">Login</button>
            </Link>
            <button className="btn btn-primary rounded-full">
              Get Started
            </button>
          </div>

          {/* Mobile Menu Icon (optional) */}
          <div className="md:hidden">
            <button>
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <div className="hero min-h-screen py-12 sm:px-4  bg-gradient-to-r from-primary/35 via-base-100 to-primary/10">
        <div className="hero-content flex-col gap-8 lg:flex-row-reverse">
          <img src="/Tested.png" className="w-fit rounded" />
          <div className="flex flex-col justify-between h-full gap-12 text-center">
            <div>
              <h1 className="text-4xl sm:text-6xl font-bold">
                Create stunning invoices within seconds!
              </h1>
              <p className="py-6">
                Type a prompt to generate invoice, share with customers and get
                paid
              </p>
            </div>

            <button className="btn btn-primary w-fit self-center rounded-full py-6 px-6">
              Get Started for free
            </button>
          </div>
        </div>
      </div>

      <div
        id="how-it-works"
        className="min-h-screen w-full flex flex-col items-center justify-center gap-12 py-16 px-8"
      >
        <h2 className="text-center text-4xl sm:text-6xl font-bold">
          How it works
        </h2>
        <p className="italic">In three simple steps</p>
        <HowItWorks />
      </div>
      <div
        id="interactive-demo"
        className="min-h-screen flex flex-col items-center justify-center gap-12 py-16 px-8"
      >
        <h2 className="text-center text-4xl sm:text-6xl font-bold">
          A simple prompt is all you need.
        </h2>
        <p className="italic rounded bg-amber-200 px-2">
          Try it yourself below
        </p>
        <div className="w-full max-w-4xl p-4 flex flex-col justify-center border border-gray-100 shadow-base shadow-2xl rounded-2xl">
          <TypingPlaceholder isUsingAI={true} text={text} setText={setText} />
          <div className="flex flex-row">
            <div className="flex flex-row w-full gap-2"></div>
            <button
              disabled={!clientId}
              onClick={() => {
                handleGenerate();
              }}
              className="btn btn-accent rounded-3xl"
            >
              Generate
            </button>
          </div>
        </div>
      </div>
      <div
        id="pricing"
        className="min-h-screen w-full flex flex-col items-center justify-center gap-12 py-16 px-8"
      >
        <h2 className="text-center text-4xl sm:text-6xl font-bold">
          One-time payment, no commitments
        </h2>
        <Plans where="home" />
        <h3 className="text-xl">
          All plans come with 30 day risk-free gurantee
        </h3>
      </div>

      <Footer />
      {step == 2 && <PreviewModal />}
    </>
  );
}
