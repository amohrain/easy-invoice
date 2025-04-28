import React from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { calculateInvoice } from "@/lib/calculate";
import { useCompanyStore } from "@/store/useCompany";
import { useInvoiceStore } from "@/store/useInvoice";
import { useTemplateStore } from "@/store/useTemplate";
import { useLoadingStore } from "@/store/useLoading";
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
import { useRouter } from "next/navigation";
import { useClientStore } from "@/store/useClient";
import Link from "next/link";

export function InvoicePreview({ setStep }) {
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

  const { template, setTemplate, userTemplates } = useTemplateStore();
  const {
    invoice,
    setInvoice,
    saveInvoice,
    postInvoice,
    invoiceId,
    fetchClientId,
    createClient,
  } = useInvoiceStore();
  const { loading, setLoading } = useLoadingStore();
  const [showModal, setShowModal] = useState(false);
  const { company } = useCompanyStore();
  const { clientId } = useClientStore();
  const currentPath = usePathname();
  const router = useRouter();

  const searchParams = useSearchParams();
  const share = searchParams.get("share");

  console.log("Client Id: ", clientId);

  useEffect(() => {
    // Return if not creating new invoice
    if (currentPath !== "/invoices/create") {
      console.log(currentPath);
      if (share) setShowModal(true);
      console.log(typeof share);
      return;
    }

    async function createInvoice() {
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
          company: company._id,
          invoiceNumber: `${invoicePrefix}/${invoiceId}/${invoiceSuffix}`,
          issuedAt: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        };

        // Fetch client details based on clientId provided
        if (clientId) {
          const clientInfo = await fetchClientId(clientId);
          updatedInvoice = { ...updatedInvoice, ...clientInfo };

          console.log("updatedInvoice: ", updatedInvoice);
        }

        setInvoice(updatedInvoice);
      }
    }
    createInvoice();
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

      if (currentPath === "/invoices/create") {
        console.log("saving invoice");
        // if client Id in invoice is absent, create a client in DB

        const baseInvoice = {
          ...invoice,
          template: template._id,
        };

        if (!invoice.clientId) {
          baseInvoice.clientId = await createClient();
        }
        const newInvoice = await postInvoice(baseInvoice);

        router.push("/invoices/" + newInvoice._id + "?share=true");
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
    if (currentPath === "/invoices/create") {
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
    <div className="flex flex-col w-full h-full">
      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-10 bg-base-200 rounded border-base-300 shadow-sm py-4 px-8 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h3 className="font-bold text-lg">
            {currentPath === "/invoices/create"
              ? "New Invoice"
              : "Edit Invoice"}
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex flex-row justify-around items-center gap-4">
            <Undo2
              className="cursor-pointer hover:text-accent"
              onClick={handleBack}
            />
            <Save
              className="cursor-pointer hover:text-accent"
              onClick={() => {
                handleSave();
              }}
            />

            <DownloadIcon className="cursor-pointer hover:text-accent" />
            {currentPath !== "/invoices/create" && (
              <Link2
                className="cursor-pointer hover:text-accent"
                onClick={handleLinkShare}
              />
            )}
            {invoice.changesSuggested && (
              <Link href={currentPath + "/suggested"}>
                <button className="btn btn-info">View Suggestions</button>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 w-full max-w-5xl self-center">
        <div className="flex flex-col w-full border shadow rounded-lg p-6 h-fit">
          {template.structure.map((section) => (
            <div
              key={section.section}
              className={`flex flex-col text-md mb-5 ${getTextStyle(
                section.style
              )}`}
            >
              {section.title &&
                section.fields.some((field) => {
                  const key = field.key;
                  return (
                    key in invoice &&
                    invoice[key] !== undefined &&
                    invoice[key] !== ""
                  );
                }) && <h3 className="font-bold mb-2">{section.title}</h3>}
              {section.section === "title" && (
                <h2
                  className={`text-3xl font-semibold mb-4
                    ${getTextStyle(section.style)}`}
                >
                  {invoice.invoiceTitle} Preview
                </h2>
              )}
              {section.section === "horizontal-line" && <hr className="" />}
              {section.section === "logo" && invoice.businessLogo && (
                <img
                  src={invoice.businessLogo}
                  className={`h-16 w-fit ${getTextStyle(section.style)}`}
                />
              )}
              {section.columns && (
                <div className="flex w-full justify-between">
                  {section.columns.map((col, colIndex) => (
                    <div
                      key={colIndex}
                      className={`flex flex-col ${getTextStyle(col.style)}`}
                    >
                      {col.fields?.map(
                        ({ key, placeholder, value, bold, size }) =>
                          key === "businessLogo" ? (
                            <img
                              key={key}
                              src={invoice.businessLogo || null}
                              className={`h-16 w-auto ${getTextStyle(
                                col.style
                              )}`}
                            />
                          ) : (
                            <div
                              key={key}
                              className={invoice[key] ? "" : "text-gray-400"}
                            >
                              <strong
                                onClick={(e) => e.target.nextSibling?.focus()} // Shift focus to input when label is clicked
                                className="cursor-pointer"
                              >
                                {!invoice[key] || value
                                  ? placeholder || key
                                  : ""}
                              </strong>
                              <span
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) =>
                                  handleChange(key, e.target.innerText.trim())
                                }
                                className={`cursor-text outline-none focus: ${
                                  bold && "font-bold"
                                }`}
                                onClick={(e) => e.target.focus()} // Ensure clicking text also focuses
                              >
                                {invoice[key] ?? ""}
                              </span>
                            </div>
                          )
                      )}
                      {/* {col.fields?.map((field) =>
                    field === "businessLogo" ? (
                      <img
                        key={field}
                        src={invoice.businessLogo || null}
                        className="h-16 w-auto"
                      />
                    ) : (
                      <div
                        key={field}
                        className={invoice[field] ? "" : "text-base-content/50"}
                      >
                        <strong
                          onClick={(e) => e.target.nextSibling?.focus()}
                          className="cursor-pointer"
                        >
                          {!invoice[field] || template.labels[field][1]
                            ? template.labels?.[field][0] || field
                            : ""}
                        </strong>
                        <span
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) =>
                            handleChange(field, e.target.innerText.trim())
                          }
                          className={`cursor-text outline-none focus: ${
                            template.labels[field][2] && "font-bold "
                          }`}
                          onClick={(e) => e.target.focus()}
                        >
                          {invoice[field] ?? ""}
                        </span>
                      </div>
                    )
                  )} */}
                    </div>
                  ))}
                </div>
              )}
              {section.fields?.map(
                ({ key, placeholder, value, bold, size }) => (
                  <div
                    key={key}
                    className={invoice[key] ? "" : "text-gray-400"}
                  >
                    <strong
                      onClick={(e) => e.target.nextSibling?.focus()} // Shift focus to input when label is clicked
                      className="cursor-pointer"
                    >
                      {!invoice[key] || value ? placeholder || key : ""}
                    </strong>
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        handleChange(key, e.target.innerText.trim())
                      }
                      className={`cursor-text outline-none focus: ${
                        bold && "font-bold"
                      }`}
                      onClick={(e) => e.target.focus()} // Ensure clicking text also focuses
                    >
                      {invoice[key] ?? ""}
                    </span>
                  </div>
                )
              )}

              {/* // Todo borders */}
              {section.section === "items" && (
                <table className="w-full mt-2 border-collapse">
                  <thead>
                    <tr
                      className={`${
                        section.tableStyle.headerFillColor
                          ? `bg-[${section.tableStyle.headerFillColor}]`
                          : ""
                      }`}
                    >
                      {section.items?.map((col) => (
                        <th
                          key={col.key}
                          className={`text-${col.alignment || "left"} ${
                            col.bold ? "font-bold" : ""
                          } p-2`}
                          style={{
                            fontSize: col.size,
                            border: section.tableStyle.border
                              ? "1px solid #ddd"
                              : "none",
                          }}
                        >
                          {col.placeholder ||
                            col.key.charAt(0).toUpperCase() + col.key.slice(1)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items?.map((item, index) => (
                      <tr key={index}>
                        {section.items.map((col) => (
                          <td
                            key={col.key}
                            className={`text-${col.alignment || "left"} font-${
                              col.bold ? "bold" : "normal"
                            } p-2`}
                            style={{
                              fontSize: col.size,
                              border: section.tableStyle.border
                                ? "1px solid #ddd"
                                : "none",
                            }}
                          >
                            <span
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                handleItemChange(
                                  index,
                                  col.key,
                                  e.target.innerText.trim()
                                )
                              }
                              className="cursor-text"
                            >
                              {item[col.key] ?? "-"}
                            </span>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {section.section === "totals" && (
                <div className="flex justify-end">
                  <div className="w-64">
                    <div className="flex justify-between">
                      {template.labels?.subtotal || "Sub Total: "}
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) =>
                          handleChange(
                            "subtotal",
                            e.target.innerText.trim() || "0"
                          )
                        }
                        className="cursor-text"
                      >
                        {invoice.subtotal ?? ""}
                      </span>
                    </div>

                    {invoice.deductions?.map((deduct, index) => (
                      <div key={index} className="flex justify-between">
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
                          className="cursor-text"
                        >
                          {deduct.description ?? ""}
                        </span>
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
                          className="cursor-text"
                        >
                          {deduct.amount ?? "0"}
                        </span>
                      </div>
                    ))}
                    {invoice.additions?.map((add, index) => (
                      <div key={index} className="flex justify-between">
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
                          className="cursor-text"
                        >
                          {add.description ?? ""}
                        </span>
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
                          className=" cursor-text"
                        >
                          {add.amount ?? "0"}
                        </span>
                      </div>
                    ))}

                    <div className="flex justify-between font-bold border-t border-gray-300 pt-2 mt-2">
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
                        className=" cursor-text"
                      >
                        {invoice.totalAmount ?? ""}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          {/* <FixedBottomBar
          onBack={handleBack}
          onSave={handleSave}
          onLinkShare={handleLinkShare}
          currentPath={currentPath}
        /> */}
        </div>
      </div>
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
