// Function to get Tailwind alignment classes
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

export function MiniInvoice({ currentTemplate, sampleInvoice }) {
  return (
    <div className="flex flex-col h-60 border-gray-300 pt-2 text-xs text-gray-600 space-y-1">
      {currentTemplate.structure.map((section) => (
        <div
          key={section.section}
          className={`flex flex-col ${getAlignmentClass(section.alignment)}`}
        >
          {section.fields?.map(
            (field) =>
              sampleInvoice[field] && (
                <div key={field} className="font-semibold">
                  {sampleInvoice[field]}
                </div>
              )
          )}
          {section.section === "horizontal-line" && (
            <hr className="my-2 border-t border-gray-300" />
          )}
          {section.section === "space" && <br />}
          {/* {section.section === "items" && (
                <div>
                  {sampleInvoice.items.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{item.description}</span>
                      <span>${item.total}</span>
                    </div>
                  ))}
                </div>
              )} */}
          {/* Render Items Table */}
          {section.section === "items" && (
            <div className="mt-2">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="border-b">
                    {[...new Set(sampleInvoice.items.flatMap(Object.keys))].map(
                      (key) => (
                        <th className="text-center" key={key}>
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </th> // Capitalizing headers
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {sampleInvoice.items.map((item, index) => (
                    <tr key={index}>
                      {[
                        ...new Set(sampleInvoice.items.flatMap(Object.keys)),
                      ].map((key) => (
                        <td className="text-center" key={key}>
                          {item[key] ?? "-"}
                        </td> // Show "-" if key is missing
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {section.section === "totals" && (
            <div className="font-semibold">
              Total: ${sampleInvoice.totalAmount}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
