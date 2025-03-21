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

export function InvoicePreview({ template, invoice, setInvoice }) {
  return (
    <div className="flex flex-col h-60 border-gray-300 pt-2 text-xs text-gray-600 space-y-1">
      {template.structure.map((section) => (
        <div
          key={section.section}
          className={`flex flex-col ${getAlignmentClass(section.alignment)}`}
        >
          {section.fields?.map(
            (field) =>
              invoice[field] && (
                <div key={field} className="font-semibold">
                  {invoice[field]}
                </div>
              )
          )}
          {section.section === "horizontal-line" && (
            <hr className="my-2 border-t border-gray-300" />
          )}
          {section.section === "space" && <br />}
          {/* Render Items Table */}
          {section.section === "items" && (
            <div className="mt-2">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="border-b">
                    {[...new Set(invoice.items.flatMap(Object.keys))].map(
                      (key) => (
                        <th className="text-center" key={key}>
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </th> // Capitalizing headers
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={index}>
                      {[...new Set(invoice.items.flatMap(Object.keys))].map(
                        (key) => (
                          <td className="text-center" key={key}>
                            {item[key] ?? "-"}
                          </td> // Show "-" if key is missing
                        )
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {section.section === "totals" && (
            <div className="font-semibold">Total: ${invoice.totalAmount}</div>
          )}
        </div>
      ))}
    </div>
  );
}
