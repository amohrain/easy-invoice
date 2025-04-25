// import pdfMake from "pdfmake/build/pdfmake";
// import pdfFonts from "pdfmake/build/vfs_fonts";

// pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { getPdfMake } from "../../lib/pdfmake";

const pdfMake = await getPdfMake();

const generateInvoicePDF = (invoice, template) => {
  // Set default styles based on template
  const defaultStyle = {
    fontSize: template.fontSize || 12,
  };

  // Helper function to create label-value text
  const labelValue = (label, value) => {
    if (!value) return null;
    return { text: `${label}${value}`, margin: [0, 2, 0, 2] };
  };

  // Generate document content based on template structure
  const docDefinition = {
    content: [],
    styles: {
      header: {
        fontSize: 16,
        bold: true,
        margin: [0, 0, 0, 10],
      },
      subheader: {
        fontSize: 14,
        bold: true,
        margin: [0, 10, 0, 5],
      },
      tableHeader: {
        bold: true,
        fontSize: 12,
        color: "black",
        fillColor: "#f0f0f0",
      },
      totalsTable: {
        margin: [0, 10, 0, 10],
      },
    },
    defaultStyle: defaultStyle,
  };

  // Process each section of the template
  template.structure.forEach((section) => {
    switch (section.section) {
      case "header":
        const headerColumns = [];

        section.columns.forEach((column) => {
          const columnContent = [];

          column.fields.forEach((field) => {
            if (field === "businessLogo" && invoice.businessLogo) {
              columnContent.push({
                image: invoice.businessLogo,
                width: 150,
                alignment: column.style?.alignment || "left",
              });
            } else if (field === "businessName") {
              columnContent.push({
                text: invoice[field],
                style: {
                  fontSize: section.style?.fontSize || 16,
                  bold: section.style?.bold || true,
                  alignment: column.style?.alignment || "left",
                },
                margin: [0, 2, 0, 5],
              });
            } else {
              const label = template.labels[field] || "";
              columnContent.push(labelValue(label, invoice[field]));
            }
          });

          headerColumns.push({
            stack: columnContent,
            width: "*",
            alignment: column.style?.alignment || "left",
          });
        });

        docDefinition.content.push({
          columns: headerColumns,
          margin: [0, 0, 0, 20],
        });
        break;

      case "horizontal-line":
        docDefinition.content.push({
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: 515,
              y2: 0,
              lineWidth: 1,
              lineColor: "#cccccc",
            },
          ],
          margin: [0, 10, 0, 10],
        });
        break;

      case "clientDetails":
        const clientStack = [];

        if (section.title) {
          clientStack.push({ text: section.title, style: "subheader" });
        }

        section.fields.forEach((field) => {
          if (invoice[field]) {
            const label = template.labels[field] || "";
            clientStack.push(labelValue(label, invoice[field]));
          }
        });

        docDefinition.content.push({
          stack: clientStack,
          margin: [0, 0, 0, 10],
        });
        break;

      case "invoiceDetails":
        const invoiceDetailsColumns = [];

        section.columns.forEach((column) => {
          const columnContent = [];

          column.fields.forEach((field) => {
            const label = template.labels[field] || "";
            columnContent.push(labelValue(label, invoice[field]));
          });

          invoiceDetailsColumns.push({
            stack: columnContent,
            width: "*",
            alignment: column.style?.alignment || "left",
          });
        });

        docDefinition.content.push({
          columns: invoiceDetailsColumns,
          margin: [0, 0, 0, 10],
        });
        break;

      case "items":
        // Define table headers
        const tableHeaders = section.items.map((item) => ({
          text: item.charAt(0).toUpperCase() + item.slice(1),
          style: "tableHeader",
        }));

        // Define table body
        const tableBody = invoice.items.map((item) => {
          return section.items.map((field) => {
            if (field === "rate" || field === "total") {
              return {
                text: `${invoice.currencySymbol}${item[field].toFixed(2)}`,
                alignment: "right",
              };
            }
            return { text: item[field].toString() };
          });
        });

        docDefinition.content.push({
          table: {
            headerRows: 1,
            widths: section.items.map((item) =>
              item === "description" ? "*" : "auto"
            ),
            body: [tableHeaders, ...tableBody],
          },
          layout: {
            hLineWidth: function (i, node) {
              return 1;
            },
            vLineWidth: function (i, node) {
              return 1;
            },
            hLineColor: function (i, node) {
              return "#dddddd";
            },
            vLineColor: function (i, node) {
              return "#dddddd";
            },
          },
          margin: [0, 10, 0, 10],
        });
        break;

      case "totals":
        const totalsData = [];

        // Subtotal
        totalsData.push([
          { text: "Subtotal:", alignment: "left" },
          {
            text: `${invoice.currencySymbol}${invoice.subtotal.toFixed(2)}`,
            alignment: "right",
          },
        ]);

        // Deductions
        invoice.deductions.forEach((deduction) => {
          totalsData.push([
            { text: deduction.description, alignment: "left" },
            {
              text: `${invoice.currencySymbol}${deduction.amount.toFixed(2)}`,
              alignment: "right",
            },
          ]);
        });

        // Additions
        invoice.additions.forEach((addition) => {
          totalsData.push([
            { text: addition.description, alignment: "left" },
            {
              text: `${invoice.currencySymbol}${addition.amount.toFixed(2)}`,
              alignment: "right",
            },
          ]);
        });

        // Total amount
        totalsData.push([
          { text: "Total:", alignment: "left", bold: true },
          {
            text: `${invoice.currencySymbol}${invoice.totalAmount.toFixed(2)}`,
            alignment: "right",
            bold: true,
          },
        ]);

        docDefinition.content.push({
          layout: "noBorders",
          table: {
            widths: ["*", "auto"],
            body: totalsData,
          },
          style: "totalsTable",
          margin: [0, 10, 0, 10],
          alignment: "right",
        });
        break;

      case "footer":
        const footerStack = [];

        section.fields.forEach((field) => {
          if (invoice[field]) {
            const label = template.labels[field] || "";
            footerStack.push({
              text: label,
              style: "subheader",
              margin: [0, 10, 0, 0],
            });
            footerStack.push({ text: invoice[field], margin: [0, 5, 0, 0] });
          }
        });

        if (footerStack.length > 0) {
          docDefinition.content.push({
            stack: footerStack,
            margin: [0, 20, 0, 0],
          });
        }
        break;

      case "space":
        docDefinition.content.push({ text: "", margin: [0, 10, 0, 10] });
        break;

      case "break":
        docDefinition.content.push({ text: "", pageBreak: "before" });
        break;
    }
  });

  return pdfMake.createPdf(docDefinition);
};

// Utility function to handle logo image for pdfmake
const getBase64FromUrl = async (url) => {
  if (!url) return null;

  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error fetching image:", error);
    return null;
  }
};

// Main function to generate and download the PDF
export const generateAndDownloadInvoicePDF = async (invoice, template) => {
  // If there's a logo, convert it to base64 for pdfMake
  if (invoice.businessLogo) {
    try {
      const base64Logo = await getBase64FromUrl(invoice.businessLogo);
      if (base64Logo) {
        invoice = { ...invoice, businessLogo: base64Logo };
      }
    } catch (error) {
      console.error("Error processing logo:", error);
    }
  }

  // Generate the PDF
  const pdfDocGenerator = generateInvoicePDF(invoice, template);

  // Download the PDF
  pdfDocGenerator.download(`invoice-${invoice.invoiceNumber}.pdf`);

  return pdfDocGenerator;
};

// Function to preview PDF in a new tab
export const previewInvoicePDF = async (invoice, template) => {
  // If there's a logo, convert it to base64 for pdfMake
  if (invoice.businessLogo) {
    try {
      const base64Logo = await getBase64FromUrl(invoice.businessLogo);
      if (base64Logo) {
        invoice = { ...invoice, businessLogo: base64Logo };
      }
    } catch (error) {
      console.error("Error processing logo:", error);
    }
  }

  // Generate the PDF
  const pdfDocGenerator = generateInvoicePDF(invoice, template);

  // Open the PDF in a new tab
  pdfDocGenerator.open();

  return pdfDocGenerator;
};

export default {
  generateAndDownloadInvoicePDF,
  previewInvoicePDF,
};
