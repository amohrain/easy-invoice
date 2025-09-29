import React from "react";
function ProductShowcase() {
  return (
    <section className="min-h-screen bg-gradient-to-b from-base-100/0 to-base-100 w-full flex flex-col items-center justify-center gap-8 p-4 pt-12 sm:px-4 sm:py-12 relative">
      <div className="section-heading mt-20">
        <h2 className="section-title">An effective way to invoicing</h2>
        <p className="section-description mt-5">
          Effortlessly manage your invoices in one place, see which ones are
          pending, and who are the top clients.
        </p>
      </div>

      <div className="mockup-browser rounded-lg sm:rounded-2xl bg-base-100/40 w-fit shadow-2xl">
        <div className="mockup-browser-toolbar"></div>
        <div className="flex justify-center p-4">
          <img
            className="max-w-5xl w-full rounded-sm sm:rounded-xl"
            src={"/product_showcase.png"}
          />
        </div>
      </div>
    </section>
  );
}

export default ProductShowcase;
