import React from "react";
import Footer from "../../sections/Footer";

function page() {
  return (
    <>
      <div className="container flex flex-col gap-2 py-12 px-24 mx-auto max-w-4xl text-lg text-justify">
        <h1 className="text-xl text-center font-bold mb-4">Privacy Policy</h1>
        <p className="mb-4">
          <strong>Effective Date: </strong>May 21, 2025
        </p>
        <p className="mb-4">
          Vibe Invoice ("we," "us," or "our") respects your privacy and is
          committed to protecting the personal information you share with us.
          This Privacy Policy explains how we collect, use, store, and protect
          your data when you use our website and services.
        </p>

        <h2 className="text-xl font-semibold my-4">
          1. Information We Collect
        </h2>
        <ul className="list-disc pl-6 mb-4">
          <li>
            Personal Information: Name, email address, company name, and billing
            information.
          </li>
          <li>
            Invoice Data: Customer names, invoice items, amounts, and related
            metadata.
          </li>
          <li>
            Technical Data: IP address, browser type, device information, and
            usage data via cookies and analytics tools.
          </li>
        </ul>
        <h2 className="text-xl font-semibold my-4">
          2. How We Use Your Information
        </h2>
        <ul className="list-disc pl-6 mb-4">
          <li>To provide and maintain our invoicing services.</li>
          <li>To communicate with you about updates, features, or support.</li>
          <li>For payment processing via trusted third-party providers.</li>
          <li>To improve and personalize your experience.</li>
        </ul>

        <h2 className="text-xl font-semibold my-4">
          3. Sharing Your Information. We do not sell your personal data. We may
          share it with:
        </h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Payment processors like Razorpay.</li>
          <li>Analytics and performance tools (e.g., Google Analytics).</li>
          <li>Legal authorities if required by law.</li>
        </ul>
        <h2 className="text-xl font-semibold my-4">4. Data Retention</h2>
        <p className="mb-4">
          We retain your data as long as your account is active or as needed to
          provide services and comply with legal obligations.
        </p>
        <h2 className="text-xl font-semibold my-4">5. Your Rights</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Access, correct, or delete your personal data.</li>
          <li>Withdraw consent at any time.</li>
          <li>Request data portability.</li>
        </ul>
        <h2 className="text-xl font-semibold my-4">6. Security</h2>
        <p className="mb-4">
          We use encryption, secure servers, and access control to protect your
          data.
        </p>
        <h2 className="text-xl font-semibold my-4">7. Cookies</h2>
        <p className="mb-4">
          We use cookies to enhance your experience. You can control cookie
          preferences through your browser or our cookie banner.
        </p>
        <h2 className="text-xl font-semibold my-4">8. Children’s Privacy</h2>
        <p className="mb-4">
          Our services are not intended for children under 16. We do not
          knowingly collect data from children.
        </p>
        <h2 className="text-xl font-semibold my-4">9. Contact</h2>
        <p>For any questions or data requests, contact abhishek@bulkmark.in</p>
      </div>
      <Footer />
    </>
  );
}

export default page;
