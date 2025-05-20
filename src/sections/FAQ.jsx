import { ExternalLink } from "lucide-react";
import React from "react";
const faq = [
  {
    question: "What is Vibe Invoicing?",
    answer:
      "Vibe Invoicing is a new way of creating invoices. You can create invoices by typing a prompt and our AI will generate the invoice for you.",
  },
  {
    question: "What is Vibe Invoice?",
    answer:
      "Vibe Invoice is an AI invoicing tool that helps in creating invoices within seconds.",
  },
  {
    question: "How does it work?",
    answer:
      "You can enter a prompt briefly describing the invoice and our intelligent AI will create the professional invoice for you.",
  },
  {
    question: "Is there a free plan?",
    answer: "Yes. We offer a free plan with limited features.",
  },
  {
    question: "Do I need to signup?",
    answer: "Yes.",
  },
  {
    question: "Do you support API?",
    answer:
      "Yes. We have a public API that you can use to integrate with your applications to generate invoices automatically.",
  },
  {
    question: "Do I have to create clients manually?",
    answer:
      "No. As soon as you create an invoice, a client is created automatically.",
  },
  {
    question: "How do I use saved clients?",
    answer:
      "You can use the @client tag in the prompt to pull client details automatically.",
  },
  {
    question: "What should I write in the prompt?",
    answer:
      "You can write anything that describes the invoice. For example, you can write '10 logos at $99 each, VAT @ 5%'.",
  },
  {
    question: "Can I download PDF invoices?",
    answer: "Yes.",
  },
  {
    question: "Why should I share invoice link instead of PDF?",
    answer:
      "Sharing invoice link is more convenient. Your clients can suggest changes through link and you can accept them at any time and the link will always point to the latest version.",
  },
  {
    question: "Can I use my own logo?",
    answer:
      "Yes. You can upload your own logo and it will be used in the invoice.",
  },
  {
    question: "Is my data safe?",
    answer:
      "Yes. We take data privacy seriously. Your data is stored securely and is not shared with any third parties.",
  },
  {
    question: "Can I use Vibe Invoice on mobile?",
    answer:
      "Yes, Vibe Invoice is mobile-friendly, but for best experience and precision editing, we recommend using it on a desktop or laptop.",
  },
];

function FAQ() {
  return (
    <section
      id="faq"
      className="bg-gradient-to-b from-base-200 to-base-300 w-full"
    >
      <div className="container flex flex-col md:flex-row items-start justify-between gap-12 py-16 px-8">
        <div className="section-heading flex flex-col items-center">
          <div className="badge badge-primary">FAQ</div>
          <h2 className="section-title">Frequently Asked Questions</h2>
        </div>
        <div className="join text-lg join-vertical  border-base-300 rounded-2xl overflow-hidden shadow-lg">
          {faq.map(({ question, answer }, index) => (
            <div
              key={index}
              className="collapse collapse-arrow join-item transition-all duration-200"
            >
              <input
                type="radio"
                name="faq-accordion"
                defaultChecked={index === 0}
                className="peer"
              />
              <div className="collapse-title font-semibold peer-checked:text-primary peer-checked:font-bold text-base">
                {question}
              </div>
              <div className="collapse-content text-sm">{answer}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQ;
