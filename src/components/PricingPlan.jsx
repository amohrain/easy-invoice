import React, { useState } from "react";
import PaymentButton from "./PaymentButton";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { formatCurrency } from "../lib/formatCurrency";
import { motion } from "framer-motion";

function PricingPlan({ name, mostPopular, features, amount, where, currency }) {
  const router = useRouter();
  const [invoiceLink, setInvoiceLink] = useState("");

  const ShareLinkModal = ({}) => {
    return (
      <div className="modal modal-open items-center">
        <div className="modal-box min-h-40 text-center border">
          <div className="flex flex-col gap-4">
            <h2 className="font-bold text-2xl">Thank you for the payment</h2>
            <p>Please download your invoice using below link:</p>
            <a className="link mb-4 " href={invoiceLink} target="_blank">
              Click here
            </a>
          </div>
          <button
            onClick={() => {
              setInvoiceLink("");
              window.location.reload();
            }}
            className="btn btn-primary rounded-full"
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 items-center mt-10 lg:flex-row lg:items-end lg:justify-center">
      <div
        key={name}
        className={`p-10 rounded-3xl shadow-sm shadow-base-300 max-w-xs sm:w-xs ${
          mostPopular ? "bg-neutral text-neutral-content" : "bg-base-100/50"
        }`}
      >
        <div className="flex justify-between">
          <h3 className={`text-lg font-bold`}>{name}</h3>
          {mostPopular && (
            <div className="inline-flex text-sm px-4 py-1.5 rounded-xl border border-white/20">
              <motion.span
                animate={{
                  backgroundPositionX: "-100%",
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear",
                  repeatType: "loop",
                }}
                className="bg-[linear-gradient(to_right,#DD7DDF,#E1CD86,#BBCB92,#71C2EF,#3BFFFF,#DD7DDF,#E1CD86,#BBCB92,#71C2EF,#3BFFFF,#DD7DDF)] [background-size:200%] text-transparent bg-clip-text font-medium"
              >
                Most Popular
              </motion.span>
            </div>
          )}
        </div>
        <div>
          <div className="flex items-baseline  gap-1 mt-[30px]">
            <span className="text-4xl font-bold tracking-tighter leading-none">
              {formatCurrency(amount, currency)}
            </span>

            <span className="tracking-tight font-bold">
              {amount !== 0 ? "/lifetime" : ""}
            </span>
          </div>
          <div className="mt-6">
            <PaymentButton
              name={name}
              planAmount={amount * 100}
              where={where}
              mostPopular={mostPopular}
              currency={currency}
              setInvoiceLink={setInvoiceLink}
            />
          </div>
          <ul className="flex flex-col gap-5 mt-8">
            {features.map((feature, index) => (
              <li className="text-sm flex items-center gap-4" key={index}>
                <CheckCircle className="size-4" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {invoiceLink && <ShareLinkModal />}
    </div>
  );

  // return (
  //   <div
  //     className={`card w-fit ${
  //       mostPopular ? "bg-neutral" : "bg-base-200"
  //     } shadow-sm`}
  //   >
  //     <div className="card-body min-w-[280px] w-full">
  //       <span
  //         className="badge badge-xs text-neutral badge-warning"
  //         style={{ visibility: mostPopular ? "visible" : "hidden" }}
  //       >
  //         Most Popular
  //       </span>
  //       <div className="flex flex-col justify-between">
  //         <h2
  //           className={`text-3xl font-bold ${
  //             mostPopular ? "text-neutral-content" : ""
  //           }`}
  //         >
  //           {name}
  //         </h2>
  //         <span
  //           className={`text-xl ${mostPopular ? "text-neutral-content" : ""}`}
  //         >
  //           {price}
  //         </span>
  //       </div>
  //       <ul
  //         className={`mt-6 flex flex-col gap-2 text-xs font-semibold ${
  //           mostPopular ? "text-neutral-content" : ""
  //         }`}
  //       >
  //         {features.map((feature, index) => (
  //           <li key={index}>
  //             <svg
  //               xmlns="http://www.w3.org/2000/svg"
  //               className="size-4 me-2 inline-block text-success"
  //               fill="none"
  //               viewBox="0 0 24 24"
  //               stroke="currentColor"
  //             >
  //               <path
  //                 strokeLinecap="round"
  //                 strokeLinejoin="round"
  //                 strokeWidth="2"
  //                 d="M5 13l4 4L19 7"
  //               />
  //             </svg>
  //             <span>{feature}</span>
  //           </li>
  //         ))}
  //       </ul>
  //       <div className="mt-6">
  //         <PaymentButton
  //           name={name}
  //           planAmount={amount * 100}
  //           currency={currency}
  //           where={where}
  //           setInvoiceLink={setInvoiceLink}
  //         />
  //       </div>
  //     </div>
  //     {invoiceLink && <ShareLinkModal />}
  //   </div>
  // );
}

export default PricingPlan;
