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
import DownloadIcon from "../DownloadIcon";
import { useStepsStore } from "@/store/useSteps";
import { set } from "mongoose";
import { useRouter } from "next/navigation";
import { useClientStore } from "@/store/useClient";

export function InvoicePreview({ currentInvoice }) {
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
    <div className="border w-full shadow rounded-lg m-6 p-6 h-fit overflow-y-auto">
      <h2 className="text-3xl font-semibold mb-4">Invoice</h2>
      {template.structure.map((section) => (
        <div
          key={section.section}
          className={`flex flex-col text-md mb-5 ${getTextStyle(
            section.style
          )}`}
        >
          {section.title && <h3 className="font-bold mb-2">{section.title}</h3>}
          {section.section === "horizontal-line" && <hr className="" />}
          {section.section === "logo" && invoice.businessLogo && (
            <img
              src={invoice.businessLogo}
              className={`h-16 w-fit ${getTextStyle(section.style)}`}
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
                        className="h-16 w-auto"
                      />
                    ) : (
                      <div
                        key={field}
                        className={invoice[field] ? "" : "text-base-content/50"}
                      >
                        {/* Placeholder Situation */}
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
                  )}
                </div>
              ))}
            </div>
          )}
          {/* {section.fields?.map((field) => (
            <div key={field} className={invoice[field] ? "" : "text-gray-400"}>
              <strong
                onClick={(e) => e.target.nextSibling?.focus()} // Shift focus to input when label is clicked
                className="cursor-pointer"
              >
                {!invoice[field] || template.labels[field][1]
                  ? template.labels?.[field][0] || field
                  : ""}
              </strong>
              <span
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => handleChange(field, e.target.innerText.trim())}
                className={`cursor-text outline-none focus: ${
                  template.labels[field][2] && "font-bold"
                }`}
                onClick={(e) => e.target.focus()} // Ensure clicking text also focuses
              >
                {invoice[field] ?? ""}
              </span>
            </div>
          ))} */}

          {[
            {
              key: "clientName",
              placeholder: "Client Name: ",
              value: false,
              bold: true,
              size: 14,
            },
            {
              key: "clientEmail",
              placeholder: "Client Email: ",
              value: true,
              bold: false,
              size: 14,
            },
          ].map(({ key, placeholder, value, bold, size }) => (
            <div key={key} className={invoice[key] ? "" : "text-gray-400"}>
              <strong
                onClick={(e) => e.target.nextSibling?.focus()} // Shift focus to input when label is clicked
                className="cursor-pointer"
              >
                {!invoice[key] || value ? placeholder || key : ""}
              </strong>
              <span
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => handleChange(key, e.target.innerText.trim())}
                className={`cursor-text outline-none focus: ${
                  bold && "font-bold"
                }`}
                onClick={(e) => e.target.focus()} // Ensure clicking text also focuses
              >
                {invoice[key] ?? ""}
              </span>
            </div>
          ))}

          {section.section === "items" && (
            <table className="w-full mt-2">
              <thead>
                <tr className="border-b">
                  {section.items.map((col) => (
                    <th key={col} className="">
                      {col.charAt(0).toUpperCase() + col.slice(1)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invoice.items?.map((item, index) => (
                  <tr key={index}>
                    {section.items.map((col) => (
                      <td key={col} className="">
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
                          className="cursor-text"
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
            <div className="flex justify-end">
              <div className="w-64">
                <div className="flex justify-between">
                  {template.labels?.subtotal || "Sub Total: "}
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      handleChange("subtotal", e.target.innerText.trim() || "0")
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
    </div>
  );
}
