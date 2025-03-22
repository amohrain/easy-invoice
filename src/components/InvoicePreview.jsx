import { DownloadButton } from "./DownloadButton";

const getTextStyle = (section) => {
  let style = "";
  if (section.bold) style += " font-bold";
  if (section.italic) style += " italic";
  if (section.alignment === "right") style += " text-right";
  if (section.alignment === "center") style += " text-center";
  if (section.uppercase) style += " uppercase";
  if (section.fontSize) style += ` text-[${section.fontSize}px]`;
  return style;
};

export function InvoicePreview({ template, invoice }) {
  return (
    <div className="relative flex flex-col items-center">
      <div className="w-[210px] sm:w-[420px] aspect-[210/297] border border-gray-300 bg-white p-4 shadow-md text-[min(1vw,12px)]">
        {template.structure.map((section) => (
          <div
            key={section.section}
            className={`flex flex-col text-black ${getTextStyle(section)}`}
          >
            {section.section === "horizontal-line" && <hr className="my-2" />}
            {section.fields?.map((field) => {
              // if (section.section === "totals") return null; // Prevents duplicate rendering
              const value = invoice[field];

              if (!value) return null;

              return (
                <div key={field}>
                  <strong>{template.labels?.[field] || field}</strong>
                  {value}
                </div>
              );
            })}
            {section.section === "title" && (
              <div className={`my-2 underline ${getTextStyle(section)}`}>
                <strong>{template.labels?.title.toUpperCase()}</strong>
              </div>
            )}

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
                  {invoice.items.map((item, index) => (
                    <tr key={index}>
                      {section.columns.map((col) => (
                        <td key={col} className="text-center">
                          {item[col] ?? "-"}
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
                  {template.labels?.subtotal || "Subtotal"}: {invoice.subtotal}
                </div>

                {invoice.deductions?.map((deduct, index) => (
                  <div key={index}>
                    {deduct.description} -{deduct.amount}
                  </div>
                ))}

                {invoice.additions?.map((add, index) => (
                  <div key={index}>
                    {add.description} +{add.amount}
                  </div>
                ))}

                <div className="font-bold">
                  {template.labels?.totalAmount || "Total"}:{" "}
                  {invoice.totalAmount}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <DownloadButton invoice={invoice} template={template} />
    </div>
  );
}
