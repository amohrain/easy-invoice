"use client";
import TypingPlaceholder from "@/components/TypingPlaceholder";
import { useEffect, useState } from "react";
import Link from "next/link";
import Footer from "@/sections/Footer";
import SEO from "@/components/SEO";
import Plans from "@/components/Plans";
import { useClientStore } from "../store/useClient";
import { useInvoiceStore } from "../store/useInvoice";
import { InvoicePreview } from "../components/InvoicePreview";
import { templates } from "../lib/templatesData";
import { useTemplateStore } from "../store/useTemplate";
import { sampleCompany } from "../constants/sampleCompany";
import { clients } from "../constants/clients";
import { dummyInvoice } from "../lib/dummyInvoice";
import HowItWorks from "@/sections/HowItWorks";
import { handleInvoiceGenerate } from "../lib/openai";
import { calculateInvoice } from "../lib/calculate";
import { Loading } from "../components/Loading";
import { Menu, X } from "lucide-react";

export default function Home() {
  const { setTemplate } = useTemplateStore();

  const [loading, setLoading] = useState();
  const { invoice, setInvoice } = useInvoiceStore();

  const [text, setText] = useState("");
  const [step, setStep] = useState(1);
  const { clientId, setSampleClients } = useClientStore();

  useEffect(() => {
    setTemplate(templates[0]);
    setSampleClients();
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
      const updatedInvoice = calculateInvoice(invoice);
      // const invoice = dummyInvoice;
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

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const MobileMenu = () => {
    return (
      <div
        className={`
        fixed top-0 right-0 h-full w-64 bg-base-100 shadow-lg z-20 transform transition-transform duration-300 ease-in-out
        ${isMenuOpen ? "translate-x-0" : "translate-x-full"}
        md:hidden
      `}
      >
        {/* Close Button */}
        <div className="flex justify-between p-4">
          {/* Menu Content */}
          <div className="flex flex-col w-full justify-center p-4 space-y-4">
            <Link href={"/sign-in"}>
              <button className="btn btn-outline rounded-full">Login</button>
            </Link>
            <Link href={"/sign-up"}>
              <button className="btn btn-primary rounded-full">
                Get Started
              </button>
            </Link>
          </div>
          <button
            className="p-2 self-start rounded-md"
            onClick={() => setIsMenuOpen(false)}
          >
            <X size={24} />
          </button>
        </div>
      </div>
    );
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
        title="Vibe Invoice - Create and share invoices in seconds"
        description="Create stunning invoices in seconds. Type a prompt to generate invoice, share with customers and get paid faster!"
        image="https://vibeinvoice.com/og-image.jpg"
        url="https://vibeinvoice.com"
      />
      {isMenuOpen && <MobileMenu />}

      <nav className="bg-gradient-to-r sm:px-12 from-primary/35 via-base-100 to-primary/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex gap-1">
            <img className="size-6 self-center" src={"/Logo.png"} />
            <div className="text-2xl font-bold">Vibe Invoice</div>
          </div>
          {/* Navigation Links (hidden on mobile) */}
          <div className="hidden md:flex gap-6 text-base font-medium">
            <a href="#how-it-works" className="hover:text-primary">
              How it works
            </a>
            <a href="#interactive-demo" className="hover:text-primary">
              Demo
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
            <Link href={"/sign-up"}>
              <button className="btn btn-primary rounded-full">
                Get Started
              </button>
            </Link>
          </div>

          {/* Mobile Menu Icon (optional) */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(true)}>
              <Menu />
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
                Create invoices with minimum effort!
              </h1>
              <p className="py-6">
                Type a prompt to generate invoice, share with customers and get
                paid
              </p>
            </div>
            <Link href={"/sign-up"}>
              <button className="btn btn-primary w-fit self-center rounded-full py-6 px-6">
                Get Started for free
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div
        id="how-it-works"
        className="min-h-screen w-full flex flex-col items-center justify-center gap-8 p-4 pt-12 sm:px-4 sm:py-12"
      >
        <h2 className="text-center text-4xl sm:text-6xl font-bold">
          How it works
        </h2>
        <p className="italic badge badge-accent">In three simple steps</p>
        <HowItWorks />
      </div>
      <div
        id="interactive-demo"
        className="min-h-screen flex flex-col items-center justify-center gap-8 px-4 sm:px-4 sm:py-12"
      >
        <h2 className="text-center text-4xl sm:text-6xl font-bold">
          A simple prompt is all you need.
        </h2>
        <p className="italic badge badge-accent">Try it yourself below</p>
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
        className="min-h-screen w-full flex flex-col items-center justify-center gap-12 p-4 sm:px-4 sm:py-12"
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
