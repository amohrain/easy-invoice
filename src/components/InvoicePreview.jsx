import { calculateInvoice } from "@/lib/calculate";
import { DownloadButton } from "./DownloadButton";
import { useEffect } from "react";

const getTextStyle = (section) => {
  let style = "";
  if (section.bold) style += " font-bold";
  if (section.italic) style += " italic";
  if (section.alignment === "left") style += " text-left self-start";
  if (section.alignment === "right") style += " text-right self-end";
  if (section.alignment === "center") style += " text-center self-center";
  // if (section.uppercase) style += " uppercase";
  if (section.fontSize) style += ` text-[${section.fontSize}px]`;
  return style;
};

export function InvoicePreview({ template, invoice, setInvoice, setStep }) {
  useEffect(() => {
    if (!invoice.businessName) {
      setInvoice((prev) => {
        return { ...prev, businessName: "My Business" };
      });
    }
  }, []);
  const handleChange = (field, value) => {
    // if (Object.values(template.labels).includes(value)) return;
    setInvoice((prev) => {
      const updatedInvoice = { ...prev };

      if (value.trim() === "") {
        delete updatedInvoice[field]; // Keep structure intact instead of deleting
      } else {
        updatedInvoice[field] = value;
      }

      const newInvoice = calculateInvoice(updatedInvoice); // Calculate new values
      console.log(newInvoice);
      return newInvoice;
    });
  };

  const handleItemChange = (index, field, value) => {
    setInvoice((prev) => {
      const newItems = [...prev.items];

      // Convert value to float if it's a number field, otherwise keep it as is
      newItems[index] = {
        ...newItems[index],
        [field]: field === "description" ? value : parseFloat(value) || 0,
      };

      const updatedInvoice = { ...prev, items: newItems };
      return calculateInvoice(updatedInvoice); // Calculate new totals
    });
  };

  return (
    <div className="relative flex flex-col items-center">
      <div className="w-[210px] sm:w-[420px] aspect-[210/297] border border-gray-300 bg-white p-4 shadow-md sm:text-md text-sm">
        {template.structure.map((section) => (
          <div
            key={section.section}
            className={`flex flex-col text-md text-black ${getTextStyle(
              section
            )}`}
          >
            {section.section === "horizontal-line" && (
              <hr className="my-2 text-primary" />
            )}
            {section.section === "logo" && (
              <img
                src={invoice.businessLogo}
                className={`h-10 w-fit ${getTextStyle(section)}`}
              />
            )}
            {section.columns && (
              <div className="flex w-full">
                {section.columns.map((col, colIndex) => (
                  <div key={colIndex} className={`flex-1 ${getTextStyle(col)}`}>
                    {col.fields?.map((field) =>
                      field === "businessLogo" ? (
                        <img
                          key={field}
                          src={invoice.businessLogo}
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
                  onBlur={(e) => handleChange(field, e.target.innerText.trim())}
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
                    {section.columns.map((col) => (
                      <th key={col} className="text-center">
                        {col.charAt(0).toUpperCase() + col.slice(1)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {invoice.items?.map((item, index) => (
                    <tr key={index}>
                      {section.columns.map((col) => (
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
                      handleChange("subtotal", e.target.innerText.trim() || "0")
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
                        const newDeductions = [...invoice.deductions];
                        newDeductions[index].description =
                          e.target.innerText.trim();
                        setInvoice((prev) => ({
                          ...prev,
                          deductions: newDeductions,
                        }));
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
                        const newDeductions = [...invoice.deductions];
                        newDeductions[index].amount =
                          e.target.innerText.trim() || "0";
                        setInvoice((prev) => ({
                          ...prev,
                          deductions: newDeductions,
                        }));
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
                        setInvoice((prev) => ({
                          ...prev,
                          additions: newAdditions,
                        }));
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
                        setInvoice((prev) => ({
                          ...prev,
                          additions: newAdditions,
                        }));
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
      <div className="w-full">
        <button
          onClick={() => setStep((prev) => prev - 1)}
          className="btn btn-primary w-1/2"
        >
          Back
        </button>
        <button
          onClick={() => setStep((prev) => prev + 1)}
          className="btn btn-accent w-1/2"
        >
          Next
        </button>
      </div>
    </div>
  );
}
