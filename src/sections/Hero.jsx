"use client";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Sparkles, Stars } from "lucide-react";
import { DynamicTextarea } from "../components/DynamicTextArea";

function Hero() {
  // const [text, setText] = useState("");
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"],
  });
  const translateY = useTransform(scrollYProgress, [0, 1], [150, -150]);
  useMotionValueEvent(translateY, "change", (latestValue) => {});

  return (
    <section
      ref={heroRef}
      className="hero min-h-screen py-12 sm:px-4  bg-gradient-to-r from-primary/35 via-base-100 to-primary/10 relative"
    >
      <div className="hero-content flex-col gap-20 lg:flex-row-reverse">
        {/* <img src="/Tested.png" className="w-fit rounded" /> */}
        <div className="flex flex-col justify-between h-full gap-12 text-center">
          <div className="section-heading">
            <h1 className="section-title">
              {/* Professional invoices with minimum effort! */}
              {/* Create invoices at lightning speed! */}
              {/* Invoice in 60 Seconds or Less */}
              Don't wait on invoices, send them instantly
            </h1>
            <p className="section-description mt-5">
              {/* Generate invoice, share with customers and get paid faster all
              under one minute */}
              Create and share invoices{" "}
              <span className="underline decoration-wavy decoration-secondary underline-offset-4">
                in less than a minute.
              </span>
            </p>
          </div>
          <DynamicTextarea />
          {/* <Link href={"/sign-up"}>
            <button className="btn btn-primary w-fit text-xl self-center rounded-full py-6 px-6">
              Get Started for free
            </button>
          </Link> */}
        </div>
      </div>
      {/* <motion.img
        src={"/InvoiceSearch.png"}
        className="absolute h-30 right-150 top-0"
        alt="Invoice Search"
        style={{ translateY }}
      /> */}
    </section>
  );
}

export default Hero;
