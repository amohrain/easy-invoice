import Footer from "../../sections/Footer";
export default function CookiePolicy() {
  return (
    <>
      <div className="container flex flex-col gap-2 py-12 px-24 mx-auto max-w-4xl text-lg text-justify">
        <h1 className="text-xl text-center font-bold mb-4">Cookie Policy</h1>
        <p className="mb-4">
          Vibe Invoice uses cookies to improve your experience. This Cookie
          Policy explains how we use them.
        </p>
        <h2 className="text-xl font-semibold my-4">1. What Are Cookies?</h2>
        <p className="mb-4">
          Cookies are small files stored on your device that help us recognize
          you and enhance your experience.
        </p>

        <h2 className="text-xl font-semibold my-4">2. How We Use Cookies</h2>
        <p className="mb-4">We use cookies to: </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Keep you logged in.</li>
          <li>Remember your preferences.</li>
          <li>Analyze site usage with tools like Google Analytics.</li>
        </ul>
        <h2 className="text-xl font-semibold my-4">3. Managing Cookies</h2>
        <p className="mb-4">
          You can accept or reject cookies via the cookie banner. You can also
          modify your browser settings to manage cookies. Disabling cookies may
          affect your experience.
        </p>
        <h2 className="text-xl font-semibold my-4">
          4. Updates to This Policy
        </h2>
        <p className="mb-4">
          We may update this Cookie Policy occasionally. Continued use of our
          website means you accept the changes.
        </p>
        <h2 className="text-xl font-semibold my-4">5. Contact Us</h2>
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
