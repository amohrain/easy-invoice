"use client";
import React, { useState } from "react";
import { Loader, Sparkles, X } from "lucide-react";
import { useInvoiceStore } from "../store/useInvoice";
import { handleItemsGenerate } from "../lib/openai";
import { calculateInvoice } from "../lib/calculate";

export function EditItemsModal({ closeModal }) {
  const { invoice, setInvoice } = useInvoiceStore();
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState(
    invoice.items
      .map(
        (item) =>
          `${item.quantity == 1 ? "" : item.quantity + " "}${
            item.description
          } @ ${item.rate}`
      )
      .join("\n")
  );

  const handleGenerate = async () => {
    if (loading) return;
    setLoading(true);
    const items = await handleItemsGenerate(text);
    setInvoice(calculateInvoice({ ...invoice, items }));
    closeModal();
    setLoading(false);
  };

  return (
    <dialog id="my_modal_1" className="modal modal-open">
      <div className="modal-box gap-4 bg-base-300 flex flex-col">
        <div className="flex flex-row justify-between">
          <h3 className="font-bold gradient-text text-2xl w-full text-center">
            Edit items
          </h3>
          <button onClick={closeModal} className="btn btn-ghost btn-circle">
            <X />
          </button>
        </div>
        <div className="w-full h-48 max-w-4xl py-2 sm:px-4 flex flex-col justify-center border border-gray-100 shadow-base shadow-2xl rounded-2xl">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-full whitespace-pre-wrap break-words rounded-lg text-base focus:outline-none resize-none overflow-y-auto "
            name=""
            id=""
          />

          <div className="flex flex-row justify-end">
            {/* <div className="flex flex-row w-full gap-2"></div> */}
            <button
              onClick={handleGenerate}
              className={`generate-button hover:scale-105 ${
                loading && "cursor-not-allowed"
              }`}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm mr-2"></span>
              ) : (
                <Sparkles size={18} />
              )}
              Edit
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
