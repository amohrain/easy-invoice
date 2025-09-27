import Footer from "@/sections/Footer";

export default function AboutUs() {
  return (
    <>
      <div className="py-12 px-24 mx-auto">
        <h1 className="text-3xl text-center font-bold mb-4">
          About Vibe Invoice
        </h1>
        <h2 className="text-2xl font-semibold my-4 mb-3">
          Welcome to Vibe Invoice – Invoicing, Simplified.
        </h2>

        <p className="text-lg mb-4">
          At Vibe Invoice, we believe that invoicing should be effortless, fast,
          and a little more human. Whether you're a freelancer, small business
          owner, or a growing team, managing invoices shouldn't slow you down—it
          should help you get paid and move on with your day.
        </p>

        <h2 className="text-2xl font-semibold my-4 mb-3">Our Mission</h2>
        <p className="text-lg mb-4">
          To make invoicing feel less like paperwork and more like progress.
        </p>

        <p className="text-lg mb-4">
          We're here to help you create, edit, and share professional invoices
          in minutes. Powered by smart features like AI-generated drafts,
          real-time editing, and simple sharing options, Vibe Invoice helps you
          focus on what you do best—while we take care of the numbers.
        </p>

        <h2 className="text-2xl font-semibold my-4 mb-3">
          What Makes Us Different?
        </h2>
        <ul className="px-3">
          <li className="">
            ✨ AI-Powered Invoices Describe the work you did, and we’ll generate
            a ready-to-send invoice. It’s that simple.
          </li>

          <li className="">
            ✏️ Real-Time Edits Make changes on the fly—every invoice is fully
            customizable.
          </li>

          <li className="">
            🔗 Share with a Link Send your invoice via a link and receive
            payments faster.
          </li>

          <li className="">
            🗨️ Collaborate with Clients Clients can suggest edits directly on
            your invoice—no back-and-forth emails needed.
          </li>

          <li className="">
            📥 Download & Save Download a PDF anytime or save invoices securely
            for your records.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold my-4 mb-3">Who We’re For</h2>
        <p className="text-lg mb-4">
          Designers, developers, marketers, consultants, creators, and anyone
          who needs a simple yet powerful way to bill for their work. If you
          value speed, clarity, and control, Vibe Invoice is built for you.
        </p>

        <h2 className="text-2xl font-semibold my-4 mb-3">Our Vibe</h2>
        <p className="text-lg mb-4">Professional. Friendly. Friction-free.</p>
        <p className="text-lg mb-4">
          We’re building tools that feel good to use—because getting paid should
          be a vibe.
        </p>

        <h2 className="text-2xl font-semibold my-4 mb-3">Get in Touch</h2>
        <p className="text-lg mb-4">
          We'd love to hear from you! Whether you have feedback, feature
          requests, or need support, reach out to us at{" "}
          <a href="mailto:abhishek@vibeinvoice.com" className="text-primary">
            abhishek@vibeinvoice.com
          </a>
          .
        </p>
      </div>
      <Footer />
    </>
  );
}
