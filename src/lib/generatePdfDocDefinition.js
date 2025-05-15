import { formatCurrency } from "./formatCurrency";

// Function to map border style
function mapBorderStyle(borderStyle) {
  switch (borderStyle) {
    case "allBorders":
      return {
        outsideBorders: true,
        insideVerticalBorders: true,
        dashedBorders: false,
      };
    case "noBorders":
      return {
        outsideBorders: false,
        insideVerticalBorders: false,
        insideHorizontalBorders: false,
        dashedBorders: false,
      };
    case "headerLineOnly":
      return {
        outsideBorders: false,
        insideVerticalBorders: false,
        insideHorizontalBorders: false,
        headerHorizontalBorder: true,
        dashedBorders: false,
        borderWidth: 2,
        cellPadding: 0,
      };
    case "dashedBorders":
      return {
        outsideBorders: true,
        insideVerticalBorders: true,
        insideHorizontalBorders: true,
        headerHorizontalBorder: true,
        dashedBorders: true,
      };
    case "vibeBorders":
      return {
        outsideBorders: true,
        insideVerticalBorders: true,
        insideHorizontalBorders: false,
        headerHorizontalBorder: true,
        dashedBorders: false,
      };
    case "supermanBorders":
      return {
        outsideBorders: true,
        insideVerticalBorders: true,
        insideHorizontalBorders: true,
        dashedBorders: false,
        borderColor: "#ff0000",
        borderWidth: 2,
      };

    default:
      return {
        outsideBorders: true,
        insideVerticalBorders: true,
        insideHorizontalBorders: true,
        headerHorizontalBorder: true,
        dashedBorders: false,
      };
  }
}

// Function to resolve colors
function resolveColor(template, colorKey) {
  const colors = template.style?.colors || {};
  return colors[colorKey] || "#000000";
}

// Function to control table borders
export function getCustomTableLayout(tableStyle = {}, template) {
  const {
    outsideBorders = true,
    insideVerticalBorders = true,
    insideHorizontalBorders = true,
    headerHorizontalBorder = false,
    borderColor = "content",
    borderWidth = 1,
    dashedBorders = false,
    cellPadding = 4,
  } = tableStyle;

  const lineStyle = dashedBorders
    ? { dash: { length: 4 } } // small dashes
    : undefined;

  return {
    paddingLeft: () => cellPadding,
    paddingRight: () => cellPadding,
    paddingTop: () => cellPadding,
    paddingBottom: () => cellPadding,

    // hLineWidth: function (i, node) {
    //   if (i === 0 && headerHorizontalBorder) return borderWidth; // top header line
    //   if (i === node.table.body.length) return outsideBorders ? borderWidth : 0; // bottom line
    //   return insideHorizontalBorders ? borderWidth : 0; // inside lines
    // },

    hLineWidth: function (i, node) {
      const headerRows = node.table.headerRows || 1; // how many header rows (usually 1)

      if (i === headerRows && headerHorizontalBorder) return borderWidth; // bottom of header
      if (i === 0 && outsideBorders) return borderWidth; // top outside border
      if (i === node.table.body.length && outsideBorders) return borderWidth; // bottom outside border
      return insideHorizontalBorders ? borderWidth : 0; // inside row lines
    },

    vLineWidth: function (i, node) {
      if (i === 0 || i === node.table.widths.length)
        return outsideBorders ? borderWidth : 0; // left and right outside
      return insideVerticalBorders ? borderWidth : 0; // inside verticals
    },

    hLineColor: function (i, node) {
      return resolveColor(template, borderColor);
    },

    vLineColor: function (i, node) {
      return resolveColor(template, borderColor);
    },

    ...(lineStyle && {
      hLineStyle: function (i, node) {
        return lineStyle;
      },
      vLineStyle: function (i, node) {
        return lineStyle;
      },
    }),
  };
}

// pdfMake version of your invoice rendering logic
export function generatePdfDocDefinition(template, invoice) {
  const currency = invoice.currency || "USD";
  const content = [];

  console.log(template);

  if (template.style.borders) {
    const margin = template.style.borders.margins;
    const radius = template.style.borders.radius;
    content.push({
      canvas: [
        {
          type: "rect",
          x: 10 + margin,
          y: 10 + margin,
          w: 575 - 2 * margin,
          h: 822 - 2 * margin,
          r: radius,
          lineColor: resolveColor(template, template.style.borders.color),
          lineWidth: 1,
        },
      ],
      absolutePosition: { x: 0, y: 0 },
    });
  }

  template.structure.forEach((section) => {
    const sectionContent = [];

    if (section.section === "title") {
      content.push({
        text: invoice.invoiceTitle || "Invoice",
        bold: section.style.bold || true,
        alignment: section.style.alignment,
        fontSize: section.style.size || 22,
      });
    }

    if (section.title && section.fields?.some((field) => invoice[field.key])) {
      sectionContent.push({
        text: section.title,
        alignment: section.style.alignment,
        margin: [0, 0, 0, 8],
        bold: true,
      });
    }

    if (section.section === "horizontal-line") {
      sectionContent.push({
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 0,
            x2: 515,
            y2: 0,
            lineColor: resolveColor(template, section.style.color),
            lineWidth: section.style.width || 2,
          },
        ],
      });
    }

    if (section.section === "logo" && invoice.businessLogo) {
      sectionContent.push({
        image: invoice.businessLogo, // base64 or URL
        alignment: section.style?.alignment || "left",
        fit: [150, 50],
        margin: [0, 0, 0, 0],
      });
    }

    if (section.columns) {
      const columns = section.columns.map((col) => {
        const colContent = [];

        col.fields?.forEach(
          ({ key, placeholder, amount, value, bold, size }) => {
            if (!invoice[key]) return;
            if (key === "businessLogo" && invoice.businessLogo) {
              colContent.push({
                image: invoice.businessLogo,
                fit: [150, 50],
                margin: [0, 0, 0, 0],
              });
            } else {
              const inlineContent = [];

              // If "value" is true, show the placeholder first (in bold)
              if (value) {
                inlineContent.push({
                  text: placeholder || key,
                  bold: true,
                  fontSize: size || 12,
                });
              }

              // Then show the actual field value
              inlineContent.push({
                text: invoice[key] || "",
                bold: bold || false,
                fontSize: size || 12,
              });

              colContent.push({
                text: inlineContent, // <-- use inline array here
                alignment: col.style?.alignment || "left",
                margin: [0, 2, 0, 2],
              });
            }
          }
        );

        return { stack: colContent, width: "*", style: col.style || {} };
      });
      sectionContent.push({ columns, columnGap: 20 });
    }

    if (section.fields) {
      section.fields.forEach(
        ({ key, placeholder, amount, value, bold, size }) => {
          if (!invoice[key]) return;
          const inlineContent = [];
          // If "value" is true, show placeholder first (in bold)
          if (value) {
            inlineContent.push({
              text: placeholder || key,
              bold: true,
              alignment: section.style.alignment || "left",
              fontSize: size || 12,
            });
          }

          // Then the actual field value
          inlineContent.push({
            text: invoice[key] || "",
            bold: bold || false,
            fontSize: size || 12,
          });

          sectionContent.push({
            text: inlineContent, // inline array
            margin: [0, 2, 0, 2],
          });
        }
      );
    }

    if (section.section === "items") {
      const tableBody = [];

      tableBody.push(
        section.items.map((col) => ({
          text: col.placeholder || col.key,
          margin: Array(4).fill(section.tableStyle?.cellPadding ?? 2),
          bold: col.bold || true,
          fontSize: col.size || 12,
          alignment: col.alignment || "left",
          fillColor: section.tableStyle?.headerFillColor || undefined,
        }))
      );

      invoice.items?.forEach((item) => {
        const row = section.items.map((col) => ({
          text: item[col.key] ?? "-",
          margin: Array(4).fill(section.tableStyle?.cellPadding ?? 2),
          fontSize: col.size || 12,
          alignment: col.alignment || "left",
        }));
        tableBody.push(row);
      });

      sectionContent.push({
        table: {
          headerRows: 1,
          widths: ["*", ...Array(section.items.length - 1).fill("auto")],
          body: tableBody,
        },

        layout: getCustomTableLayout(
          {
            ...section.tableStyle,
            ...mapBorderStyle(section.tableStyle.borderStyle),
          },
          template
        ),
      });
    }

    if (section.section === "totals") {
      const totalRows = [];

      // Subtotal
      totalRows.push([
        {
          text: template.labels?.subtotal || "Subtotal:",
          alignment: "left",
          border: [false, false, false, false],
        },
        {
          text: formatCurrency(invoice.subtotal, currency) ?? "",
          alignment: "right",
          border: [false, false, false, false],
        },
      ]);

      // Deductions
      invoice.deductions?.forEach((deduct) => {
        totalRows.push([
          {
            text: deduct.description ?? "",
            alignment: "left",
            border: [false, false, false, false],
          },
          {
            text: formatCurrency(deduct.amount, currency) ?? "",
            alignment: "right",
            border: [false, false, false, false],
          },
        ]);
      });

      // Additions
      invoice.additions?.forEach((add) => {
        totalRows.push([
          {
            text: add.description ?? "",
            alignment: "left",
            border: [false, false, false, false],
          },
          {
            text: formatCurrency(add.amount, currency) ?? "",
            alignment: "right",
            border: [false, false, false, false],
          },
        ]);
      });

      // Total Amount row (with top border only)
      totalRows.push([
        {
          text: template.labels?.totalAmount || "Total:",
          alignment: "left",
          bold: true,
          border: [false, true, false, false], // top border
        },
        {
          text: formatCurrency(invoice.totalAmount, currency) ?? "",
          alignment: "right",
          bold: true,
          border: [false, true, false, false], // top border
        },
      ]);

      const borderWidth = section.style?.borderWidth || 1;
      const borderColor = resolveColor(template, section.style?.borderColor);

      const totalsTable = {
        table: {
          widths: ["*", "auto"],
          body: totalRows,
        },
        layout: {
          defaultBorder: false, // no auto borders
          hLineColor: function (i, node) {
            return i === node.table.body.length - 1 ? borderColor : "#000000"; // default black if not defined
          },
          hLineWidth: function (i) {
            return borderWidth;
          },
          paddingLeft: function (i) {
            return i === 0 && 0;
          },
          paddingRight: function (i, node) {
            return i === node.table.widths.length - 1 ? 0 : 8;
          },
          paddingTop: function (i, node) {
            return i === node.table.body.length - 1 && 8;
          },
          paddingBottom: function (i, node) {
            return i === node.table.body.length - 2 && 8;
          },
        },
        margin: [0, 8, 0, 0],
      };

      sectionContent.push({
        columns: [
          { width: "60%", text: "" }, // empty left side
          { width: "40%", stack: [totalsTable] },
        ],
        columnGap: 10,
      });
    }

    content.push({
      stack: sectionContent,
      margin: [0, 0, 0, 10], // Consistent section spacing
    });
  });

  const docDefinition = {
    content,
    defaultStyle: {
      fontSize: template.style.defaultStyle.size || 12,
      color: resolveColor(template, template.style.defaultStyle.fontColor),
    },
  };

  return docDefinition;
}
