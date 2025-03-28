"use client";
import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

import dynamic from "next/dynamic";
import InvoiceDocument from "@/components/ReactPDF";

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  { ssr: false }
);

function page() {
  return (
    <div className="flex flex-row h-screen w-screen justify-center">
      <PDFViewer height={500} className="self-center">
        <InvoiceDocument />
      </PDFViewer>
    </div>
  );
}

export default page;
