import Footer from "../../sections/Footer";
export default function Page() {
  return (
    <>
      <div className="container flex flex-col gap-2 py-12 px-24 mx-auto max-w-4xl text-lg text-justify">
        <h1 className="text-xl text-center font-bold mb-4">Terms of service</h1>
        <p className="mb-4">
          <strong>Effective Date: </strong>May 21, 2025
        </p>

        <p className="mb-4">
          <strong>1. Services. </strong>
          Vibe Invoice provides tools for creating, managing, and sharing
          invoices.
        </p>

        <p className="mb-4">
          <strong>2. Account Responsibilities. </strong>You are responsible for
          maintaining the confidentiality of your account and any activity under
          it.
        </p>
        <p className="mb-4">
          <strong>3. Payments and Refunds</strong>
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Paid plans are paid only one-time</li>
          <li>We offer a 30 day risk free gurantee</li>
        </ul>

        <p className="mb-4">
          <strong>4. Prohibited Use. </strong> You agree not to:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Use our services for unlawful activities.</li>
          <li>Attempt to reverse-engineer or harm the platform.</li>
        </ul>
        <p className="mb-4">
          <strong>5. Termination. </strong> We reserve the right to suspend or
          terminate accounts for violations of these terms.
        </p>
        <p className="mb-4">
          <strong>6. Disclaimer. </strong>We provide our services "as is"
          without warranties. We are not responsible for lost data, damages, or
          errors. The content and features of Vibe Invoice are for informational
          and invoicing purposes only. Vibe Invoice does not offer accounting,
          legal, or tax advice. Always consult a professional for such matters.
        </p>
        <p className="mb-4">
          <strong>7. Limitation of Liability. </strong> Our liability is limited
          to the amount paid by you in the last 12 months.
        </p>
        <p className="mb-4">
          <strong>8. Governing Law. </strong>These terms are governed by the
          laws of India.
        </p>
        <p>
          For questions, contact us at{" "}
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
