"use client";
// import BookmarkPreview from "@/components/BookmarkPreview";
import Nav from "@/components/Nav";
import TypingPlaceholder from "@/components/TypingPlaceholder";
import PricingPlan from "@/components/PricingPlan";
import { useEffect, useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import Plans from "@/components/Plans";
import { useClientStore } from "../store/useClient";
import { useInvoiceStore } from "../store/useInvoice";
import { InvoicePreview } from "../components/InvoicePreview";
import { templates } from "../lib/templatesData";
import { useTemplateStore } from "../store/useTemplate";
import { clients } from "../constants/clients";
import { dummyInvoice } from "../lib/dummyInvoice";

export default function Home() {
  const { setTemplate } = useTemplateStore();

  const [loading, setLoading] = useState();
  const { invoice, setInvoice } = useInvoiceStore();

  const [text, setText] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const { clientId, setSampleClients } = useClientStore();

  useEffect(() => {
    setTemplate(templates[0]);
    setSampleClients();
  }, []);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const invoice = dummyInvoice;
      const clientInfo = clients.find((client) => client._id === clientId);
      setInvoice({ ...invoice, ...clientInfo });
      setLoading(false);
      setShowPreview(true);
    } catch (error) {
      console.log("Error generating invoice: ", error);
    }
  };

  const PreviewModal = () => {
    return (
      <div className="fixed inset-0 bg-base-100 flex items-center justify-center z-50 overflow-y-auto">
        {/* <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full p-6 relative "> */}
        <button
          onClick={() => setShowPreview(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-black text-2xl font-bold"
        ></button>
        <InvoicePreview preview={true} editable={true} />
        {/* </div> */}
      </div>
    );
  };

  return (
    <>
      <SEO
        title="Bulkmark - PDF Bookmarks in One Click"
        description="Create hundreds of PDF bookmarks instantly with Bulkmark. Save time and boost efficiency!"
        image="https://bulkmark.in/og-image.jpg"
        url="https://bulkmark.in"
      />
      <div className="p-4">
        <Nav />
      </div>
      <div className="hero border mt-[-120px] min-h-screen">
        {/* <div className="hero-overlay"></div> */}
        <div className="hero-content text-center">
          <div className="flex flex-col w-full">
            <h1 className="mb-5 text-5xl sm:text-6xl font-bold">
              Create stunning invoices instantly
            </h1>
            <p className="mb-5 sm:text-2xl">
              Type a prompt, give it a human touch, and share with customers.
            </p>
            <button className=" w-fit self-center rounded-full btn btn-primary sm:btn-xl">
              <Link href={"/sign-up"}>Get Started with Vibe Invoice</Link>
            </button>
          </div>
          {/* <img width={400} src={"/Images.png"} /> */}
        </div>
      </div>
      <div className="min-h-screen flex flex-col items-center justify-center gap-12 py-16 px-8">
        <h2 className="text-center text-4xl sm:text-6xl font-bold">
          A simple prompt is all you need.
        </h2>
        <div className="w-full max-w-4xl p-4 flex flex-col justify-center border border-gray-100 shadow-base shadow-2xl rounded-2xl">
          <TypingPlaceholder isUsingAI={true} text={text} setText={setText} />
          <div className="flex flex-row">
            <div className="flex flex-row w-full gap-2"></div>
            <button
              disabled={!clientId}
              onClick={() => {
                // setShowPreview(true);
                handleGenerate();
              }}
              className="btn btn-accent rounded-3xl"
            >
              Generate
            </button>
          </div>
        </div>
      </div>
      <div className="min-h-screen w-full flex flex-col items-center justify-center gap-12 py-16 px-8">
        <h2 className="text-center text-4xl sm:text-6xl font-bold">
          Perfect sharable invoice in seconds
        </h2>
        <img />
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
      {showPreview && <PreviewModal />}
    </>
  );
}
