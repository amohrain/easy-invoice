import { dummyInvoice } from "@/lib/dummyInvoice";

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

export function MiniInvoice({ currentTemplate }) {
  dummyInvoice.businessName = "Abhishek";
  return (
    <div className="flex flex-col p-4 text-[6px] space-y-1 bg-white text-black rounded">
      {currentTemplate.structure.map((section) => (
        <div
          key={section.section}
          className={`flex flex-col ${getAlignmentClass(section.alignment)}`}
        >
          {section.fields?.map(
            (field) =>
              dummyInvoice[field] && (
                <div key={field} className="font-semibold">
                  {dummyInvoice[field]}
                </div>
              )
          )}
          {section.section === "horizontal-line" && (
            <hr className="my-2 border-t border-gray-300" />
          )}
          {section.section === "space" && <br />}
          {/* {section.section === "items" && (
                <div>
                  {dummyInvoice.items.map((item, index) => (
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
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    {[...new Set(dummyInvoice.items.flatMap(Object.keys))].map(
                      (key) => (
                        <th className="text-center" key={key}>
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </th> // Capitalizing headers
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {dummyInvoice.items.map((item, index) => (
                    <tr key={index}>
                      {[
                        ...new Set(dummyInvoice.items.flatMap(Object.keys)),
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
              Total: ${dummyInvoice.totalAmount}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
