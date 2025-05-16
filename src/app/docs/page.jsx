"use client";
import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { nightOwl } from "react-syntax-highlighter/dist/esm/styles/prism";
// import NavigationBar from "../../sections/NavigationBar";
import Footer from "../../sections/Footer";

export default function ApiDocs() {
  return (
    <>
      {/* <NavigationBar /> */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
        <div className="flex flex-col-reverse items-center">
          <a className="link link-hover" href="/">
            back
          </a>
          <h1 className="w-full text-4xl font-bold text-primary text-center">
            Vibe Invoice API Documentation
          </h1>
        </div>

        {/* Introduction */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Introduction</h2>
          <p>
            The Vibe Invoice API allows you to programmatically generate
            invoices by sending client, item, and tax information to our
            endpoint. This guide provides a complete overview of how to use the
            API effectively.
          </p>
        </section>

        {/* Endpoint */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Endpoint</h2>

          <pre className="mockup-code rounded">
            <SyntaxHighlighter
              className="rounded"
              language="javascript"
              style={nightOwl}
            >
              POST https://vibeinvoice.com/api/invoice/generate-invoice
            </SyntaxHighlighter>
          </pre>
        </section>

        {/* Authentication */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Authentication</h2>
          <p>
            Include your API key in the request header using the{" "}
            <code>x-api-key</code> field. You can generate your API key from
            Company tab
          </p>

          <pre className="mockup-code rounded">
            <SyntaxHighlighter
              className="rounded"
              language="json"
              style={nightOwl}
            >
              "x-api-key": "replace-with-your-api-key"
            </SyntaxHighlighter>
          </pre>
        </section>

        {/* Request Body */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Request Body</h2>
          <p>Send a JSON object with the following structure:</p>
          <pre className="mockup-code p-4 rounded text-sm overflow-x-auto">
            <SyntaxHighlighter
              className="rounded"
              language="json"
              style={nightOwl}
            >
              {`{
  "clientName": "string",
  "clientEmail": "string",
  "clientAddress": "string",
  "clientPhone": "string",
  "clientTaxId": "string",
  "items": [
    { "description": "string", "quantity": number, "rate": number }
  ],
  "additions": [
    { "description": "string", "percent": number }
  ],
  "deductions": [
    { "description": "string", "percent": number }
  ],
  "status": "string",
  "notes": "string"
}`}
            </SyntaxHighlighter>
          </pre>
        </section>

        {/* Sample Request
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Sample Request</h2>
          <pre className="mockup-code p-4 rounded text-sm overflow-x-auto whitespace-pre">
            <SyntaxHighlighter
              className="rounded"
              language="javascript"
              style={nightOwl}
            >
              {`curl -X POST https://vibeinvoice.com/api/generate-invoice \

  -H "Content-Type: application/json" \

  -H "x-api-key: your-api-key" \
  
  -d '{
    "clientName": "Shree Kirana Stores",
    "clientEmail": "kiranastore@gmail.com",
    "clientAddress": "Bazaar Road, Nashik",
    "clientPhone": "0253-223344",
    "clientTaxId": "GST998877",
    "items": [
        { "description": "Bulk Sugar Order", "quantity": 100, "rate": 42 },
        { "description": "Jaggery Packs", "quantity": 50, "rate": 55 }
        ],
    "additions": [
        { "description": "GST @5%", "percent": 5 },
        { "description": "Packaging Charges", "amount": 20 }
        ],
    "deductions": [
            { "description": "Seasonal Discount", "percent": 3 }
            ],
            "status": "Partially Paid",
            "notes": "Remaining balance to be cleared before next dispatch."
            }'`}
            </SyntaxHighlighter>
          </pre>
        </section> */}

        {/* Items Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Items</h2>
          <p>
            The <code>items</code> array contains all the goods or services
            being billed. Each item must have a<code>description</code>,{" "}
            <code>quantity</code>, and <code>rate</code> (unit price). The total
            is calculated as <code>quantity × rate</code>.
          </p>
          <pre className="mockup-code">
            <SyntaxHighlighter language="json" style={nightOwl}>
              {`"items": [
  { "description": "Bulk Sugar Order", "quantity": 100, "rate": 42 },
  { "description": "Jaggery Packs", "quantity": 50, "rate": 55 }
  ]`}
            </SyntaxHighlighter>
          </pre>
        </section>

        {/* Additions Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Additions</h2>
          <p>
            Use the <code>additions</code> array to add extra charges like taxes
            or packaging. You can specify either a<code>percent</code>{" "}
            (percentage of subtotal) or a fixed <code>amount</code>.
          </p>
          <pre className="mockup-code">
            <SyntaxHighlighter language="json" style={nightOwl}>
              {`"additions": [
  { "description": "GST @5%", "percent": 5 },
  { "description": "Packaging Charges", "amount": 20 }
]`}
            </SyntaxHighlighter>
          </pre>
        </section>

        {/* Deductions Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Deductions</h2>
          <p>
            Use the <code>deductions</code> array to apply discounts to the
            invoice. You can specify either a<code>percent</code> (percentage of
            subtotal) or a fixed <code>amount</code>.
          </p>
          <pre className="mockup-code">
            <SyntaxHighlighter language="json" style={nightOwl}>
              {`"deductions": [
  { "description": "Usual Discount", "percent": 3 }
  { "description": "Seasonal Discount", "amount": 300 }
]`}
            </SyntaxHighlighter>
          </pre>
        </section>

        {/* Response */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Response</h2>
          <p>
            On success, the API returns a JSON object with the generated invoice
            link:
          </p>
          <pre className="mockup-code p-4 rounded text-sm">
            <SyntaxHighlighter
              className="rounded"
              language="json"
              style={nightOwl}
            >
              "success": true, "invoiceUrl": "https://vibeinvoice.com/view/1234"
            </SyntaxHighlighter>
          </pre>
        </section>

        {/* Error Handling */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Error Handling</h2>
          <p>
            In case of errors, you'll receive a JSON response with an error
            message:
          </p>
          <pre className="mockup-code p-4 rounded text-sm">
            <SyntaxHighlighter
              className="rounded"
              language="json"
              style={nightOwl}
            >
              "success": false, "error": "Invalid API key"
            </SyntaxHighlighter>
          </pre>
        </section>

        {/* Contact */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Support</h2>
          <p>
            For questions, reach out to me at
            <a
              href="mailto:support@vibeinvoice.com"
              className="text-primary underline ml-1"
            >
              abhishek@vibeinvoice.com
            </a>
          </p>
        </section>
      </div>
      <Footer />
    </>
  );
}
