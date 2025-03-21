import { DownloadButton } from "./DownloadButton";

const getAlignmentClass = (alignment) => {
  switch (alignment) {
    case "left":
      return "text-left";
    case "right":
      return "text-right";
    case "center":
      return "text-center";
    default:
      return "";
  }
};

export function InvoicePreview({ template, invoice }) {
  return (
    <div className="relative flex justify-center items-center">
      <div className="w-[210px] sm:w-[420px] aspect-[210/297] border border-gray-300 p-4 shadow-md text-[min(1vw,12px)]">
        {template.structure.map((section) => (
          <div
            key={section.section}
            className={`flex flex-col ${getAlignmentClass(section.alignment)}`}
          >
            {/* Render Text Fields */}
            {section.fields?.map(
              (field) =>
                invoice[field] && (
                  <div key={field} className="font-semibold">
                    {invoice[field]}
                  </div>
                )
            )}

            {/* Render Horizontal Line */}
            {section.section === "horizontal-line" && (
              <hr className="my-2 border-t border-gray-300" />
            )}

            {/* Render Space */}
            {section.section === "space" && <br />}

            {/* Render Items Table */}
            {section.section === "items" && (
              <div className="mt-2">
                <table className="w-full border-collapse border border-gray-300 text-[min(1vw,12px)]">
                  <thead>
                    <tr className="border-b ">
                      {[...new Set(invoice.items.flatMap(Object.keys))].map(
                        (key) => (
                          <th
                            className="text-center p-1 border border-gray-300"
                            key={key}
                          >
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item, index) => (
                      <tr key={index} className="border-b">
                        {[...new Set(invoice.items.flatMap(Object.keys))].map(
                          (key) => (
                            <td
                              className="text-center p-1 border border-gray-300"
                              key={key}
                            >
                              {item[key] ?? "-"}
                            </td>
                          )
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Render Total Amount */}
            {section.section === "totals" && (
              <div className="font-semibold mt-2 text-right">
                Total: ${invoice.totalAmount}
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Download Button Below Preview */}
      <DownloadButton invoice={invoice} />
    </div>
  );
}
