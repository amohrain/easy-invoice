import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ThemeController from "../components/ThemeController";
import { Toaster } from "sonner";
import CookieBanner from "../components/CookieBanner";
import AddInvoiceButton from "../components/AddInvoiceButton";
import { getSEOTags, renderSchemaTags } from "../lib/seo";
import AnalyticsHandler from "../components/AnalyticsHandler";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = getSEOTags({
  title: "Vibe Invoice",
  description: "Create stunning invoices using AI Prompts!",
  keywords:
    "invoice, invoicing tool, ai invoice, fast invoice, quick invoice, create invoice faster, vibe invoice",
  openGraph: {
    title: "Vibe Invoice",
    description: "Create stunning invoices using AI Prompts!",
    image: `https://vibeinvoice.com/og-image.png`,
  },
});

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          {renderSchemaTags()}
          <Script
            async
            src="https://www.googletagmanager.com/gtag/js?id=AW-17588532087"
          />
          <Script id="google-ads-init" strategy="afterInteractive">
            {`
           window.dataLayer = window.dataLayer || [];
           function gtag(){dataLayer.push(arguments);}
           gtag('js', new Date());

           gtag('config', 'AW-17588532087');
          `}
          </Script>
          <Script id="google-ads-conversion" strategy="afterInteractive">
            {`
    function gtag_report_conversion(url) {
      var callback = function () {
        if (typeof(url) != 'undefined') {
          window.location = url;
        }
      };
      gtag('event', 'conversion', {
        'send_to': 'AW-17588532087/LmJkCJKsiJ8bEPfm7sJB',
        'value': 3999.0,
        'currency': 'INR',
        'transaction_id': '',
        'event_callback': callback
      });
      return false;
    }
  `}
          </Script>
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
          <AnalyticsHandler />
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
