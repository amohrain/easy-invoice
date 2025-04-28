import { useParams } from "next/navigation";
import { useInvoiceStore } from "@/store/useInvoice";
import { useTemplateStore } from "@/store/useTemplate";
import { useEffect, useState } from "react";
import { Edit, Loader } from "lucide-react";
import DownloadIcon from "./DownloadIcon";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function InvoiceSuggest() {
  const { id } = useParams();
  const router = useRouter();

  const getTextStyle = (section) => {
    let style = "";
    if (!section) return style;
    if (section.bold) style += " font-bold";
    if (section.italic) style += " italic";
    if (section.alignment === "left") style += " text-left self-start";
    if (section.alignment === "right") style += " text-right self-end";
    if (section.alignment === "center") style += " text-center self-center";
    if (section.fontSize) style += ` text-[${section.fontSize}px]`;
    return style;
  };

  const { template, getTemplateById } = useTemplateStore();
  const {
    invoice,
    getInvoiceById,
    suggestion,
    fetchSuggestion,
    acceptSuggestions,
  } = useInvoiceStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getInvoice() {
      console.log("Fetching invoice");
      const invoice = await getInvoiceById(id);
      if (!invoice.changesSuggested) router.push("/invoices/" + invoice._id);
      await getTemplateById(invoice.template);
      await fetchSuggestion();
    }
    getInvoice();
  }, []);

  const handleSuggestions = async () => {
    setLoading(true);
    await acceptSuggestions();
    router.push("/invoices/" + invoice._id);
  };

  if (!template || !invoice || !suggestion || loading) return <Loader />;

  return (
    <div className="flex flex-col w-full h-full">
      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-10 bg-base-200 rounded border-base-300 shadow-sm py-4 px-8 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <h3 className="font-bold text-2xl">Vibe Invoice</h3>
          </Link>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex flex-row justify-around gap-4">
            <button onClick={handleSuggestions} className="btn btn-info">
              <Edit />
              Accept
            </button>
            <DownloadIcon button className="cursor-pointer hover:text-accent" />
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
                              <strong className="cursor-pointer">
                                {invoice[key] && value
                                  ? placeholder || key
                                  : ""}
                              </strong>
                              <span
                                className={`cursor-text outline-none focus: ${
                                  bold && "font-bold"
                                } ${
                                  suggestion[key] &&
                                  suggestion[key] !== invoice[key] &&
                                  "text-red-500 line-through"
                                }`}
                              >
                                {invoice[key] ?? ""}
                              </span>
                              {suggestion[key] &&
                                suggestion[key] !== invoice[key] && (
                                  <span
                                    className={`text-info ${
                                      bold && "font-bold"
                                    }`}
                                  >
                                    {suggestion[key]}
                                  </span>
                                )}
                            </div>
                          )
                      )}
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
                    <strong className="cursor-pointer">
                      {invoice[key] && value ? placeholder || key : ""}
                    </strong>
                    <span
                      className={`cursor-text outline-none focus: ${
                        bold && "font-bold"
                      } ${
                        suggestion[key] !== invoice[key] &&
                        suggestion[key] &&
                        "text-red-500 line-through"
                      }`}
                    >
                      {invoice[key] ?? ""}
                    </span>
                    {suggestion[key] && suggestion[key] !== invoice[key] && (
                      <span className={`text-info ${bold && "font-bold"}`}>
                        {suggestion[key]}
                      </span>
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
                            <span className="cursor-text">
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
                      <span className="cursor-text">
                        {invoice.subtotal ?? ""}
                      </span>
                    </div>

                    {invoice.deductions?.map((deduct, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="cursor-text">
                          {deduct.description ?? ""}
                        </span>
                        <span className="cursor-text">
                          {deduct.amount ?? "0"}
                        </span>
                      </div>
                    ))}
                    {invoice.additions?.map((add, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="cursor-text">
                          {add.description ?? ""}
                        </span>
                        <span className=" cursor-text">
                          {add.amount ?? "0"}
                        </span>
                      </div>
                    ))}

                    <div className="flex justify-between font-bold border-t border-gray-300 pt-2 mt-2">
                      {template.labels?.totalAmount || "Total"}
                      <span className=" cursor-text">
                        {invoice.totalAmount ?? ""}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
