import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ThemeController from "../components/ThemeController";
import { Toaster } from "sonner";
import CookieBanner from "../components/CookieBanner";
import AddInvoiceButton from "../components/AddInvoiceButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Vibe Invoice",
  description: "Create stunning invoices using AI Prompts!",
  // keywords:
  //   "invoice, invoicing tool, ai invoice, fast invoice, quick invoice, create invoice faster, vibe invoice",
  // authors: [{ name: "Vibe Invoice" }],
  // creator: "Vibe Invoice",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
          <CookieBanner />
          <div>
            <Toaster richColors closeButton />
            <ThemeController />
            <AddInvoiceButton />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
