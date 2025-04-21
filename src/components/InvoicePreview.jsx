import { usePathname } from "next/navigation";
import { calculateInvoice } from "../lib/calculate";
import { useCompanyStore } from "../store/useCompany";
import { useInvoiceStore } from "../store/useInvoice";
import { useTemplateStore } from "../store/useTemplate";
import { useLoadingStore } from "../store/useLoading";
import { useEffect, useState } from "react";
import {
  ArrowLeftCircle,
  ArrowRightCircle,
  Copy,
  CopyCheck,
  Link2,
  Save,
  Undo2,
} from "lucide-react";
import DownloadIcon from "./DownloadIcon";
import { useStepsStore } from "../store/useSteps";
import { set } from "mongoose";
import { useRouter } from "next/navigation";

const getTextStyle = (section) => {
  let style = "";
  if (!section) return style;
  if (section.bold) style += " font-bold";
  if (section.italic) style += " italic";
  if (section.alignment === "left") style += " text-left self-start";
  if (section.alignment === "right") style += " text-right self-end";
  if (section.alignment === "center") style += " text-center self-center";
  // if (section.uppercase) style += " uppercase";
  if (section.fontSize) style += ` text-[${section.fontSize}px]`;
  return style;
};

export function InvoicePreview({ setStep }) {
  const { template, setTemplate, templatesData } = useTemplateStore();
  const { invoice, setInvoice, saveInvoice, postInvoice, invoiceId } =
    useInvoiceStore();
  const { loading, setLoading } = useLoadingStore();
  const [showModal, setShowModal] = useState(false);
  const { company } = useCompanyStore();
  const currentPath = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Return if not creating new invoice
    if (currentPath !== "/dashboard") {
      console.log("Not creating new invoice");
      return;
    }

    console.log("Creating new invoice", invoice);

    let updatedInvoice = calculateInvoice(invoice);
    if (!updatedInvoice.businessName) {
      const {
        businessName,
        businessAddress,
        businessEmail,
        businessPhone,
        businessLogo,
        invoicePrefix,
        invoiceSuffix,
      } = company;

      // Logic to get invoice number

      updatedInvoice = {
        ...updatedInvoice,
        businessName,
        businessAddress,
        businessEmail,
        businessPhone,
        businessLogo,
        invoiceId,
        invoiceNumber: `${invoicePrefix}/${invoiceId}/${invoiceSuffix}`,
      };

      setInvoice(updatedInvoice);
    }
  }, [invoice]);

  const handleChange = (field, value) => {
    // if (Object.values(template.labels).includes(value)) return;
    const updatedInvoice = { ...invoice };

    if (value.trim() === "") {
      delete updatedInvoice[field];
    } else {
      updatedInvoice[field] = value;
    }
    // Calculate new values
    setInvoice(calculateInvoice(updatedInvoice));
  };

  const handleItemChange = (index, field, value) => {
    const items = [...invoice.items];

    // Convert value to float if it's a number field, otherwise keep it as is
    items[index] = {
      ...items[index],
      [field]: field === "description" ? value : parseFloat(value) || 0,
    };

    const updatedInvoice = { ...invoice, items: items };
    setInvoice(calculateInvoice(updatedInvoice));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      if (currentPath === "/dashboard") {
        const newInvoice = await postInvoice({
          ...invoice,
          template: template._id,
        });
        router.push("/invoices/" + newInvoice._id);
      } else {
        await saveInvoice(template._id);
      }
    } catch (error) {
      console.error("Error saving invoice:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (currentPath === "/dashboard") {
      setStep((prev) => prev - 1);
    } else {
      window.history.back();
    }
  };

  // todo - implement share link
  const handleLinkShare = () => {
    setShowModal(true);
  };

  return (
    <div className="relative flex flex-row items-center gap-4">
      <button
        disabled={templatesData.findIndex((t) => t == template) === 0}
        onClick={() => {
          const index = templatesData.findIndex((t) => t === template);
          setTemplate(templatesData[index - 1]);
        }}
        className="btn btn-circle btn-neutral"
      >
        <ArrowLeftCircle className="size-8" />
      </button>
      <div className="flex flex-col bg-base-300 p-4 rounded-xl gap-4">
        <div className="w-[210px] sm:w-[420px] aspect-[210/297] border border-gray-300 bg-white p-4 shadow-md sm:text-md text-sm rounded-md">
          {template.structure.map((section) => (
            <div
              key={section.section}
              className={`flex flex-col text-md text-black ${getTextStyle(
                section.style
              )}`}
            >
              {section.section === "horizontal-line" && (
                <hr className="my-2 text-primary" />
              )}
              {section.section === "logo" && invoice.businessLogo && (
                <img
                  src={invoice.businessLogo}
                  className={`h-10 w-fit ${getTextStyle(section.style)}`}
                />
              )}
              {section.columns && (
                <div className="flex w-full">
                  {section.columns.map((col, colIndex) => (
                    <div
                      key={colIndex}
                      className={`flex-1 ${getTextStyle(col.style)}`}
                    >
                      {col.fields?.map((field) =>
                        field === "businessLogo" ? (
                          <img
                            key={field}
                            src={invoice.businessLogo || null}
                            className="h-10 w-auto"
                          />
                        ) : (
                          <div
                            key={field}
                            className={invoice[field] ? "" : "text-gray-400"}
                          >
                            <strong
                              onClick={(e) => e.target.nextSibling?.focus()}
                              className="cursor-pointer"
                            >
                              {!invoice[field]
                                ? template.labels?.[field] || field
                                : ""}
                            </strong>
                            <span
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                handleChange(field, e.target.innerText.trim())
                              }
                              className="whitespace-pre-wrap border-b border-dashed border-gray-200 cursor-text outline-none focus:text-black"
                              onClick={(e) => e.target.focus()}
                            >
                              {invoice[field] ?? ""}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  ))}
                </div>
              )}
              {section.fields?.map((field) => (
                <div
                  key={field}
                  className={invoice[field] ? "" : "text-gray-400"}
                >
                  <strong
                    onClick={(e) => e.target.nextSibling?.focus()} // Shift focus to input when label is clicked
                    className="cursor-pointer"
                  >
                    {!invoice[field] ? template.labels?.[field] || field : ""}
                  </strong>
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      handleChange(field, e.target.innerText.trim())
                    }
                    className="whitespace-pre-wrap border-b border-dashed border-gray-200 cursor-text outline-none focus:text-black"
                    onClick={(e) => e.target.focus()} // Ensure clicking text also focuses
                  >
                    {invoice[field] ?? ""}
                  </span>
                </div>
              ))}

              {section.section === "items" && (
                <table className="w-full border-collapse text-xs mt-2">
                  <thead>
                    <tr className="border-b">
                      {section.items.map((col) => (
                        <th key={col} className="text-center">
                          {col.charAt(0).toUpperCase() + col.slice(1)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items?.map((item, index) => (
                      <tr key={index}>
                        {section.items.map((col) => (
                          <td key={col} className="text-center">
                            <span
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                handleItemChange(
                                  index,
                                  col,
                                  e.target.innerText.trim()
                                )
                              }
                              className="border-b border-dashed cursor-text"
                            >
                              {item[col] ?? "-"}
                            </span>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {section.section === "totals" && (
                <div className="mt-2 text-right">
                  <div>
                    {template.labels?.subtotal || "Sub total "}:
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        handleChange(
                          "subtotal",
                          e.target.innerText.trim() || "0"
                        )
                      }
                      className="border-b border-dashed cursor-text"
                    >
                      {invoice.subtotal ?? ""}
                    </span>
                  </div>

                  {invoice.deductions?.map((deduct, index) => (
                    <div key={index}>
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => {
                          const deductions = [...invoice.deductions];
                          deductions[index].description =
                            e.target.innerText.trim();
                          setInvoice({
                            ...invoice,
                            deductions,
                          });
                        }}
                        className="border-b border-dashed cursor-text"
                      >
                        {deduct.description ?? ""}
                      </span>
                      -
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => {
                          const deductions = [...invoice.deductions];
                          deductions[index].amount =
                            e.target.innerText.trim() || "0";
                          setInvoice({
                            ...invoice,
                            deductions,
                          });
                        }}
                        className="border-b border-dashed cursor-text"
                      >
                        {deduct.amount ?? "0"}
                      </span>
                    </div>
                  ))}

                  {invoice.additions?.map((add, index) => (
                    <div key={index}>
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => {
                          const newAdditions = [...invoice.additions];
                          newAdditions[index].description =
                            e.target.innerText.trim();
                          setInvoice({
                            ...invoice,
                            additions: newAdditions,
                          });
                        }}
                        className="border-b border-dashed cursor-text"
                      >
                        {add.description ?? ""}
                      </span>
                      +
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => {
                          const newAdditions = [...invoice.additions];
                          newAdditions[index].amount =
                            e.target.innerText.trim() || "0";
                          setInvoice({
                            ...invoice,
                            additions: newAdditions,
                          });
                        }}
                        className="border-b border-dashed cursor-text"
                      >
                        {add.amount ?? "0"}
                      </span>
                    </div>
                  ))}

                  <div className="font-bold">
                    {template.labels?.totalAmount || "Total"}
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        handleChange(
                          "totalAmount",
                          e.target.innerText.trim() || "0"
                        )
                      }
                      className="border-b border-dashed cursor-text"
                    >
                      {invoice.totalAmount ?? ""}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex flex-row justify-around gap-4">
          <Undo2 className="cursor-pointer" onClick={handleBack} />
          <Save
            className="cursor-pointer"
            onClick={() => {
              handleSave();
            }}
          />

          <DownloadIcon className="cursor-pointer" />
          <Link2 className="cursor-pointer" onClick={handleLinkShare} />
        </div>
      </div>

      <button
        disabled={
          templatesData.findIndex((t) => t == template) ===
          templatesData.length - 1
        }
        onClick={() => {
          const index = templatesData.findIndex((t) => t === template);
          setTemplate(templatesData[index + 1]);
        }}
        className="btn btn-circle btn-neutral"
      >
        <ArrowRightCircle className="size-8" />
      </button>
      {showModal && <ShareLinkModal setShowModal={setShowModal} />}
    </div>
  );
}

const ShareLinkModal = ({ setShowModal }) => {
  const [copied, setCopied] = useState(false);
  return (
    <div className="modal modal-open modal-end">
      <div className="modal-box">
        <h2 className="font-bold text-2xl">Share Invoice</h2>
        <p>Copy the link below to share your invoice:</p>
        <div className="relative mt-4">
          <input
            id="input-link"
            type="text"
            className="input input-bordered w-full pr-10" // extra padding for icon space
            value={window.location.href + "/view"}
            readOnly
          />
          <button
            onClick={() => {
              setCopied(true);
              navigator.clipboard.writeText(window.location.href);
              document.getElementById("input-link").select();
              setTimeout(() => {
                setCopied(false);
              }, 10000);
            }}
            className={`absolute right-2 top-1/2 -translate-y-1/2 hover:text-accent/55 ${
              copied && "text-accent"
            }`}
          >
            <div className="flex">
              <span className="">
                {!copied ? (
                  <Copy className="w-5 h-5" />
                ) : (
                  <CopyCheck className="w-5 h-5" />
                )}
              </span>
            </div>
          </button>
        </div>
        <div className="modal-action">
          <button className="btn" onClick={() => setShowModal(false)}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
