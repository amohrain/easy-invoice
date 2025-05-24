import Footer from "../../sections/Footer";

export default function Page() {
  return (
    <>
      <div className="container flex flex-col gap-2 py-12 px-24 mx-auto max-w-4xl text-lg text-justify">
        <h1 className="text-xl text-center font-bold mb-4">
          Refund and Cancellation Policy
        </h1>

        <p className="text-lg mb-4">
          At <span className="font-semibold">Vibe Invoice</span>, we stand by
          the quality of our service and offer a 30-day risk-free guarantee. If
          you're not satisfied with your purchase, you may request a refund or
          cancellation within 30 days.
        </p>

        <h2 className="text-2xl font-semibold my-4 mb-4">Refund Eligibility</h2>
        <ul className="list-disc list-inside text-lg ">
          <li>
            Refund requests must be made within{" "}
            <span className="font-semibold">30 days</span> of purchase.
          </li>
          <li>
            All refund or cancellation requests must be sent to
            <a href="mailto:abhishek@vibeinvoice.com" className="text-primary">
              {" "}
              abhishek@vibeinvoice.com
            </a>
            .
          </li>
          <li>
            Approved refunds will be processed within{" "}
            <span className="font-semibold">5–7 working days</span>
            and credited to the original payment method.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold my-4 mb-4">
          Exceptions to Refunds
        </h2>
        <ul className="list-disc list-inside text-lg mb-4">
          <li>
            Refunds will not be provided for requests made{" "}
            <span className="font-semibold">after 30 days</span> of purchase.
          </li>
          <li>
            Refunds may be denied in cases of{" "}
            <span className="font-semibold">
              misuse, policy violations, or fraudulent activities
            </span>
            .
          </li>
        </ul>

        <h2 className="text-2xl font-semibold my-4 mb-4">Need Help?</h2>
        <p className="text-lg">
          For any refund or cancellation inquiries, please contact us at
          <a href="abhishek@vibeinvoice.com" className="text-primary">
            {" "}
            abhishek@vibeinvoice.com
          </a>
          . Our team is happy to assist you.
        </p>
      </div>
      <Footer />
    </>
  );
}
