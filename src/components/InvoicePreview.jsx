import React from "react";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { calculateInvoice } from "@/lib/calculate";
import { useCompanyStore } from "@/store/useCompany";
import { useInvoiceStore } from "@/store/useInvoice";
import { useTemplateStore } from "@/store/useTemplate";
import { useLoadingStore } from "@/store/useLoading";
import { useEffect, useState } from "react";
import {
  Check,
  Copy,
  CopyCheck,
  Edit,
  Link2,
  Loader,
  Save,
  Undo2,
  X,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import DownloadIcon from "./DownloadIcon";
import { useRouter } from "next/navigation";
import { useClientStore } from "@/store/useClient";
import { templates } from "../lib/templatesData";
import { formatCurrency } from "../lib/formatCurrency";
import Link from "next/link";
import { generateUPILink } from "../lib/generateUPILink";

export function InvoicePreview({ setStep, editable, preview }) {
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

  // const { template, getUsersTemplates, getTemplateById } = useTemplateStore();
  const template = templates[0];

  const {
    invoice,
    setInvoice,
    saveInvoice,
    postInvoice,
    invoiceId,
    fetchClientId,
    createClient,
    suggestion,
    createSuggestion,
    fetchSuggestion,
    acceptSuggestions,
    acceptOneSuggestion,
    rejectSuggestion,
    deleteSuggestion,
  } = useInvoiceStore();
  const { loading, setLoading } = useLoadingStore();
  const [showModal, setShowModal] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);
  const { company } = useCompanyStore();
  const { clientId } = useClientStore();
  const currentPath = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const share = searchParams.get("share");
  const { id } = useParams();

  // use effect to fetch suggestions after they have been created
  useEffect(() => {
    async function fetchData() {
      if (!editable) await fetchSuggestion();
    }
    fetchData();
  }, [showSuggestionModal]);

  useEffect(() => {
    // Return if not creating new invoice
    if (currentPath !== "/invoices/create") {
      console.log(currentPath);
      setSaved(false);
      // setInvoice(calculateInvoice(invoice));
      if (share) setShowModal(true);
      return;
    }
    async function createInvoice() {
      let updatedInvoice = { ...invoice };
      if (!updatedInvoice.businessName) {
        const {
          businessName,
          businessAddress,
          businessEmail,
          businessPhone,
          businessLogo,
          notes,
          paymentInstructions,
          QR,
          qrText,
        } = company;

        updatedInvoice = {
          ...updatedInvoice,
          businessName,
          businessAddress,
          businessEmail,
          businessPhone,
          businessLogo,
          invoiceId,
          company: company._id,
          currency: company.currency || "USD",
          invoiceNumber: `INV-${invoiceId}`,
          issuedAt: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          notes,
          paymentInstructions,
          qrText,
        };

        // Fetch client details based on clientId provided
        if (clientId) {
          const clientInfo = await fetchClientId(clientId);
          updatedInvoice = { ...updatedInvoice, ...clientInfo };
        }
        console.log("updatedInvoice: ", updatedInvoice);
        const calculatedInvoice = calculateInvoice(updatedInvoice);

        if (company.autoAddUPI)
          calculatedInvoice.QR = generateUPILink(
            company.upiId,
            calculatedInvoice.totalAmount
          );

        setInvoice(calculatedInvoice);
      }
    }
    createInvoice();
  }, []);

  const handleChange = (field, value) => {
    // if (Object.values(template.labels).includes(value)) return;
    const updatedInvoice = { ...invoice };

    if (value.trim() === "") {
      updatedInvoice[field] = "";
    } else {
      updatedInvoice[field] = value;
    }

    console.log("invoice updated: ", updatedInvoice);

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

    const calculatedInvoice = calculateInvoice(updatedInvoice);

    if (company.autoAddUPI)
      calculatedInvoice.QR = generateUPILink(
        company.upiId,
        calculatedInvoice.totalAmount
      );

    setInvoice(calculatedInvoice);
  };

  const handleSave = async () => {
    if (currentPath === "/") return router.push("/sign-up");
    try {
      setLoading(true);

      if (currentPath === "/invoices/create") {
        // if client Id in invoice is absent, create a client in DB

        const baseInvoice = {
          ...invoice,
          template: template._id,
        };
        console.log("saving invoice", baseInvoice);

        if (!invoice.clientId) {
          baseInvoice.clientId = await createClient();
          console.log("New Client ID: ", baseInvoice.clientId);
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
      setSaved(true);
    }
  };

  const handleBack = () => {
    if (currentPath === "/invoices/create") {
      setStep((prev) => prev - 1);
    } else if (currentPath === "/") {
      setStep((prev) => prev - 1);
    } else {
      window.history.back();
    }
  };

  const [showQRModal, setShowQRModal] = useState(false);
  const InvoiceQRModal = () => {
    const [link, setLink] = useState(invoice.QR || "");

    const handleGenerateUPILink = () => {
      if (!company?.upiId) {
        alert("Please set your UPI ID in company settings.");
        return;
      }
      const upiLink = generateUPILink(company.upiId, invoice.totalAmount);
      setLink(upiLink);
      handleChange("QR", upiLink);
      setShowQRModal(false);
    };

    return (
      <div className="modal modal-open modal-end">
        <div className="modal-box">
          <div className="flex justify-between">
            <h2 className="font-bold text-2xl">Add QR Code</h2>
            <button
              onClick={() => {
                handleChange("QR", link);
                setShowQRModal(false);
              }}
              className="btn btn-ghost btn-circle"
            >
              <X />
            </button>
          </div>
          <p>
            Please enter the payment link below to generate a QR code for your
            invoice.
          </p>
          <div className="flex py-4">
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Payment Link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
            <button
              onClick={() => {
                handleChange("QR", link);
                setShowQRModal(false);
              }}
              className="btn btn-primary"
            >
              Add QR
            </button>
          </div>
          {company?.upiId && (
            <div className="flex flex-col gap-2 text-center">
              <p className="font-bold">OR</p>
              <button
                onClick={handleGenerateUPILink}
                className="btn btn-primary"
              >
                Generate UPI Link
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const handleLinkShare = () => {
    setShowModal(true);
  };

  const SuggestEdits = () => {
    const [suggestedData, setSuggestedData] = useState({
      clientName: suggestion?.clientName || invoice?.clientName,
      clientAddress: suggestion?.clientAddress || invoice?.clientAddress,
      clientPhone: suggestion?.clientPhone || invoice?.clientPhone,
      clientEmail: suggestion?.clientEmail || invoice?.clientEmail,
      clientTaxId: suggestion?.clientTaxId || invoice?.clientTaxId,
    });

    const handleCreateSuggestion = async () => {
      await createSuggestion(suggestedData);
      setShowSuggestionModal(false);
    };

    if (!invoice || !template) {
      return (
        <div className="flex w-full h-screen items-center justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      );
    }

    return (
      <dialog id="my_modal_1" className="modal modal-open glass">
        <div className="modal-box">
          <div className="">
            <fieldset className="fieldset w-full bg-base-100 shadow p-4 rounded-lg gap-2">
              <legend className="text-lg font-medium">Suggest Changes</legend>

              <div className="w-full">
                <label className="fieldset-label block mb-2">Your Name</label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder=""
                  value={suggestedData?.clientName || ""}
                  onChange={(e) =>
                    setSuggestedData((prev) => ({
                      ...prev,
                      clientName: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="w-full">
                <label className="fieldset-label block mb-2">
                  Your Address
                </label>
                <textarea
                  type="text"
                  className="input input-bordered h-24 pt-2 w-full resize-none"
                  placeholder={invoice.clientAddress}
                  value={suggestedData?.clientAddress || ""}
                  onChange={(e) =>
                    setSuggestedData((prev) => ({
                      ...prev,
                      clientAddress: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="w-full">
                <label className="fieldset-label block mb-2">Your Phone</label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder={invoice.clientPhone}
                  value={suggestedData?.clientPhone || ""}
                  onChange={(e) =>
                    setSuggestedData((prev) => ({
                      ...prev,
                      clientPhone: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="w-full">
                <label className="fieldset-label block mb-2">Your Email</label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder={invoice.clientEmail}
                  value={suggestedData?.clientEmail || ""}
                  onChange={(e) =>
                    setSuggestedData((prev) => ({
                      ...prev,
                      clientEmail: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="w-full">
                <label className="fieldset-label block mb-2">Your tax ID</label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder={invoice.clientTaxId}
                  value={suggestedData?.clientTaxId || ""}
                  onChange={(e) =>
                    setSuggestedData((prev) => ({
                      ...prev,
                      clientTaxId: e.target.value,
                    }))
                  }
                />
              </div>
            </fieldset>

            <div className="modal-action">
              <button
                onClick={handleCreateSuggestion}
                className="btn btn-success"
              >
                Submit
              </button>
              <button
                onClick={() => setShowSuggestionModal(false)}
                className="btn"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </dialog>
    );
  };

  const handleAcceptSuggestions = async () => {
    setLoading(true);
    await acceptSuggestions();
    await fetchSuggestion();
  };

  const handleAcceptOneSuggestion = async (key) => {
    handleChange(key, suggestion[key]);
    await acceptOneSuggestion();
  };

  const hideShareModal = () => {
    setShowModal(false);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("share"); // or params.delete(key) to remove
    console.log(params);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="p-6 w-full max-w-5xl self-center">
        <div className="flex flex-col w-full border shadow rounded-lg p-6 h-fit">
          {template.structure.map((section) => (
            <div
              key={section.section}
              className={`flex flex-col w-full text-md mb-5 ${getTextStyle(
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
                <div className="flex w-full justify-between">
                  <h2
                    className={`text-xl sm:text-2xl font-semibold mb-4
                    ${getTextStyle(section.style)}`}
                  >
                    {invoice.invoiceTitle} Preview
                  </h2>
                  <div className="flex flex-row justify-around items-center gap-4">
                    {preview && (
                      <>
                        <button
                          onClick={() => router.refresh()}
                          className="btn btn-ghost btn-primary rounded-full"
                        >
                          Retry
                        </button>

                        <Link href={"/sign-up"}>
                          <button className="btn btn-ghost btn-primary rounded-full">
                            Get Started
                          </button>
                        </Link>
                      </>
                    )}
                    {editable && currentPath === "/invoices/create" && (
                      <Undo2
                        className="cursor-pointer hover:text-accent"
                        onClick={handleBack}
                      />
                    )}

                    {editable && currentPath !== "/playground" && (
                      <Save
                        className={`cursor-pointer hover:text-accent ${
                          saved && "text-gray-400"
                        }`}
                        onClick={() => {
                          handleSave();
                        }}
                      />
                    )}

                    <DownloadIcon className="cursor-pointer hover:text-accent" />
                    {currentPath !== "/invoices/create" &&
                      editable &&
                      !preview && (
                        <Link2
                          className="cursor-pointer hover:text-accent"
                          onClick={handleLinkShare}
                        />
                      )}
                    {editable && invoice.changesSuggested && (
                      <button
                        onClick={handleAcceptSuggestions}
                        className="btn btn-info"
                      >
                        <Check />
                        Accept All
                      </button>
                    )}

                    {!editable && (
                      <button
                        onClick={() => setShowSuggestionModal(true)}
                        className="btn btn-info"
                      >
                        <Edit />
                        Suggest
                      </button>
                    )}
                  </div>
                </div>
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
                        ({ key, placeholder, amount, value, bold, size }) =>
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
                              className={`${
                                invoice[key] ? "" : "text-gray-400"
                              }`}
                            >
                              <strong
                                onClick={(e) => e.target.nextSibling?.focus()} // Shift focus to input when label is clicked
                                className="cursor-pointer"
                              >
                                {!invoice[key] && !editable
                                  ? ""
                                  : !invoice[key] || value
                                  ? placeholder || key
                                  : ""}
                              </strong>
                              <span
                                contentEditable={editable}
                                suppressContentEditableWarning
                                onBlur={(e) =>
                                  editable &&
                                  handleChange(key, e.target.innerText.trim())
                                }
                                className={`cursor-text outline-none whitespace-pre-wrap ${
                                  bold ? "font-bold" : ""
                                } ${
                                  suggestion?.[key] !== undefined &&
                                  suggestion?.[key] !== invoice[key]
                                    ? "text-red-500 line-through"
                                    : ""
                                }`}
                              >
                                {invoice[key] ?? ""}
                              </span>
                              {suggestion?.[key] !== undefined &&
                                suggestion[key] !== invoice[key] && (
                                  <div>
                                    <span
                                      className={`text-info ${
                                        bold && "font-bold"
                                      }`}
                                    >
                                      {suggestion[key]}
                                    </span>
                                    {/* <button
                                    onClick={() => console.log("key")}
                                    className="ml-2 p-0.5 btn btn-success btn-circle btn-xs"
                                  >
                                    <Check />
                                  </button>
                                  <button className="ml-2 p-0.5 btn btn-error btn-circle btn-xs">
                                    <X />
                                  </button> */}
                                  </div>
                                )}
                            </div>
                          )
                      )}
                    </div>
                  ))}
                </div>
              )}
              {section.fields?.map(
                ({ key, placeholder, QR, value, bold, size }) => (
                  <div
                    key={key}
                    className={invoice[key] ? "" : "text-gray-400"}
                  >
                    {QR ? (
                      <div className="flex gap-2">
                        {invoice[key] && (
                          <QRCodeSVG
                            className="my-2 cursor-pointer"
                            onClick={() => router.push(invoice[key], "_blank")}
                            value={invoice[key] ?? "HELLO"}
                            size={128} // Size in pixels
                            // bgColor="#ffffff" // Background color
                            fgColor="#000000" // Foreground color
                            level="H" // Error correction level ('L', 'M', 'Q', 'H')
                            marginSize={2} // Adds white margin
                          />
                        )}

                        <Edit
                          onClick={() => setShowQRModal(true)}
                          className="size-3 mt-2 hover:text-accent cursor-pointer"
                        />
                      </div>
                    ) : (
                      <div>
                        <strong
                          onClick={(e) => e.target.nextSibling?.focus()} // Shift focus to input when label is clicked
                          className="cursor-pointer"
                        >
                          {!invoice[key] && !editable
                            ? ""
                            : !invoice[key] || value
                            ? placeholder || key
                            : ""}
                        </strong>
                        <span
                          contentEditable={editable}
                          suppressContentEditableWarning
                          onBlur={(e) =>
                            editable &&
                            handleChange(key, e.target.innerText.trim())
                          }
                          className={`cursor-text outline-none whitespace-pre-wrap ${
                            bold ? "font-bold" : ""
                          } ${
                            suggestion?.[key] !== undefined &&
                            suggestion?.[key] !== invoice[key]
                              ? "text-red-500 line-through"
                              : ""
                          }`}
                        >
                          {invoice[key] ?? ""}
                        </span>

                        {suggestion?.[key] !== undefined &&
                          suggestion[key] !== invoice[key] && (
                            <span
                              className={`text-info ${bold && "font-bold"}`}
                            >
                              {suggestion[key]}
                              {editable && (
                                <>
                                  <button
                                    onClick={() =>
                                      handleAcceptOneSuggestion(key)
                                    }
                                    className="ml-2 p-0.5 btn btn-success btn-circle btn-xs"
                                  >
                                    <Check />
                                  </button>
                                  <button
                                    onClick={() => rejectSuggestion(key)}
                                    className="ml-2 p-0.5 btn btn-error btn-circle btn-xs"
                                  >
                                    <X />
                                  </button>
                                </>
                              )}
                            </span>
                          )}
                      </div>
                    )}
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
                              contentEditable={editable}
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                editable &&
                                handleItemChange(
                                  index,
                                  col.key,
                                  e.target.innerText.trim()
                                )
                              }
                              className="cursor-text"
                            >
                              {col.key === "total"
                                ? typeof item[col.key] === "number"
                                  ? item[col.key].toFixed(2)
                                  : "-"
                                : item[col.key] ?? "-"}
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
                        contentEditable={editable}
                        suppressContentEditableWarning
                        onBlur={(e) =>
                          editable &&
                          handleChange(
                            "subtotal",
                            e.target.innerText.trim() || "0"
                          )
                        }
                        className="cursor-text"
                      >
                        {formatCurrency(invoice.subtotal, invoice.currency) ??
                          ""}
                      </span>
                    </div>

                    {invoice.deductions?.map((deduct, index) => (
                      <div key={index} className="flex justify-between">
                        <span
                          contentEditable={editable}
                          suppressContentEditableWarning
                          onBlur={(e) => {
                            if (!editable) return;
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
                          // contentEditable={editable}
                          // suppressContentEditableWarning
                          // onBlur={(e) => {
                          //   if (!editable) return;
                          //   const deductions = [...invoice.deductions];
                          //   deductions[index].amount =
                          //     e.target.innerText.trim() || "0";
                          //   setInvoice({
                          //     ...invoice,
                          //     deductions,
                          //   });
                          // }}
                          className="cursor-text"
                        >
                          {/* {invoice.currencySymbol}
                          {deduct.amount?.toFixed(2) ?? "0"} */}

                          {formatCurrency(deduct.amount, invoice.currency) ??
                            ""}
                        </span>
                      </div>
                    ))}
                    {invoice.additions?.map((add, index) => (
                      <div key={index} className="flex justify-between">
                        <span
                          contentEditable={editable}
                          suppressContentEditableWarning
                          onBlur={(e) => {
                            if (!editable) return;
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
                          // contentEditable={editable}
                          // suppressContentEditableWarning
                          // onBlur={(e) => {
                          //   if (!editable) return;
                          //   const newAdditions = [...invoice.additions];
                          //   newAdditions[index].amount =
                          //     e.target.innerText.trim() || "0";
                          //   setInvoice({
                          //     ...invoice,
                          //     additions: newAdditions,
                          //   });
                          // }}
                          className=" cursor-text"
                        >
                          {/* {invoice.currencySymbol}
                          {add.amount?.toFixed(2) ?? "0"} */}
                          {formatCurrency(add.amount, invoice.currency) ?? ""}
                        </span>
                      </div>
                    ))}

                    <div className="flex justify-between font-bold border-t border-gray-300 pt-2 mt-2">
                      {template.labels?.totalAmount || "Total"}
                      <span
                        // contentEditable={editable}
                        // suppressContentEditableWarning
                        // onBlur={(e) => {
                        //   if (!editable) return;
                        //   handleChange(
                        //     "totalAmount",
                        //     e.target.innerText.trim() || "0"
                        //   );
                        // }}
                        className=" cursor-text"
                      >
                        {/* {invoice.currencySymbol}
                        {invoice.totalAmount?.toFixed(2) ?? ""} */}
                        {formatCurrency(
                          invoice.totalAmount,
                          invoice.currency
                        ) ?? ""}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          “It took
          {invoice?.timeTaken && invoice.timeTaken < 60
            ? ` ${invoice.timeTaken} seconds`
            : " a few minute"}{" "}
          to create this invoice using Vibe Invoice."{" "}
          {!editable && (
            <a
              href="https://www.vibeinvoice.com"
              className="link hover:link-hover"
            >
              Create your own →
            </a>
          )}
        </div>
      </div>
      {showModal && <ShareLinkModal hide={hideShareModal} />}
      {showQRModal && <InvoiceQRModal />}
      {showSuggestionModal && (
        <SuggestEdits
        // setShowModal={setShowModal}
        // data={suggestedData}
        />
      )}
    </div>
  );
}

const ShareLinkModal = ({ hide }) => {
  const { invoice } = useInvoiceStore();
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
            value={process.env.NEXT_PUBLIC_BASE_URL + "/view/" + invoice._id}
            readOnly
          />
          <button
            onClick={() => {
              setCopied(true);
              navigator.clipboard.writeText(
                process.env.NEXT_PUBLIC_BASE_URL + "/view/" + invoice._id
              );
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
          <button className="btn" onClick={() => hide()}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
