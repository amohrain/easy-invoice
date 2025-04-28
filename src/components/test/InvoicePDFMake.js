import { getPdfMake } from "../../lib/pdfmake";
const pdfMake = await getPdfMake();

// // This file contains the functions to generate invoices with pdfMake
// const pdfMake = require("pdfmake/build/pdfmake");
// const pdfFonts = require("pdfmake/build/vfs_fonts");
// pdfMake.vfs = pdfFonts.pdfMake.vfs;

/**
 * Generates a PDF invoice document based on invoice data and template
 * @param {Object} invoice - The invoice data
 * @param {Object} template - The template configuration
 * @returns {Object} - pdfMake document definition
 */
function generateInvoicePdf(invoice, template) {
  // Initialize document definition
  const docDefinition = {
    content: [],
    styles: {
      header: {
        fontSize: 18,
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
        margin: [0, 10, 0, 0],
      },
    },
    defaultStyle: {
      fontSize: template.fontSize || 12,
    },
  };

  // Process each section from the template structure
  template.structure.forEach((section) => {
    switch (section.section) {
      case "header":
        addHeaderSection(docDefinition, section, invoice);
        break;
      case "horizontal-line":
        addHorizontalLine(docDefinition);
        break;
      case "clientDetails":
        addClientDetails(docDefinition, section, invoice);
        break;
      case "invoiceDetails":
        addInvoiceDetails(docDefinition, section, invoice);
        break;
      case "items":
        addItemsTable(docDefinition, section, invoice);
        break;
      case "totals":
        addTotals(docDefinition, section, invoice);
        break;
      case "notes":
      case "Payment instructions":
        addNotesSection(docDefinition, section, invoice);
        break;
      case "space":
        docDefinition.content.push({ text: "", margin: [0, 10, 0, 10] });
        break;
    }
  });

  return docDefinition;
}

/**
 * Add header section with logo and business details
 */
function addHeaderSection(docDefinition, section, invoice) {
  const headerColumns = [];

  // Process each column in the header
  section.columns.forEach((column) => {
    const columnContent = [];

    if (column.fields) {
      column.fields.forEach((field) => {
        if (field.key === "businessLogo" && invoice.businessLogo) {
          // columnContent.push({
          //   image: invoice.businessLogo,
          //   width: 150,
          //   alignment: column.style?.alignment || "left",
          // });
        } else if (invoice[field.key] && invoice[field.key] !== "") {
          const fieldLabel = field.value ? field.placeholder : "";
          const fieldText = fieldLabel
            ? `${fieldLabel}${invoice[field.key]}`
            : invoice[field.key];

          columnContent.push({
            text: fieldText,
            bold: field.bold,
            fontSize: field.size,
            alignment: column.style?.alignment || "left",
          });
        }
      });
    }

    if (columnContent.length > 0) {
      headerColumns.push(columnContent);
    }
  });

  // Only add the header if we have content
  if (headerColumns.length > 0) {
    docDefinition.content.push({
      columns: headerColumns.map((column) => ({
        stack: column,
        width: "*",
      })),
      columnGap: 10,
    });
  }

  // Add the invoice title
  docDefinition.content.push({
    text: "INVOICE",
    style: "header",
    alignment: "center",
    margin: [0, 20, 0, 10],
  });
}

/**
 * Add horizontal line
 */
function addHorizontalLine(docDefinition) {
  docDefinition.content.push({
    canvas: [
      {
        type: "line",
        x1: 0,
        y1: 0,
        x2: 515,
        y2: 0,
        lineWidth: 1,
        lineColor: "#dddddd",
      },
    ],
    margin: [0, 5, 0, 5],
  });
}

/**
 * Add client details section
 */
function addClientDetails(docDefinition, section, invoice) {
  const clientContent = [];

  if (section.title) {
    clientContent.push({
      text: section.title,
      style: "subheader",
    });
  }

  section.fields.forEach((field) => {
    if (invoice[field.key] && invoice[field.key] !== "") {
      const fieldLabel = field.value ? "" : field.placeholder;
      const fieldText = fieldLabel
        ? `${fieldLabel}${invoice[field.key]}`
        : invoice[field.key];

      clientContent.push({
        text: fieldText,
        bold: field.bold,
        fontSize: field.size,
        margin: [0, 2, 0, 0],
      });
    }
  });

  if (clientContent.length > 0) {
    docDefinition.content.push({
      stack: clientContent,
      margin: [0, 10, 0, 10],
    });
  }
}

/**
 * Add invoice details with columns layout
 */
function addInvoiceDetails(docDefinition, section, invoice) {
  const detailColumns = [];

  section.columns.forEach((column) => {
    const columnContent = [];

    if (column.fields) {
      column.fields.forEach((field) => {
        if (invoice[field.key] && invoice[field.key] !== "") {
          const fieldLabel = field.placeholder || "";
          const fieldText = `${fieldLabel}${invoice[field.key]}`;

          columnContent.push({
            text: fieldText,
            bold: field.bold,
            fontSize: field.size,
            alignment: column.style?.alignment || "left",
            margin: [0, 2, 0, 0],
          });
        }
      });
    }

    if (columnContent.length > 0) {
      detailColumns.push(columnContent);
    }
  });

  if (detailColumns.length > 0) {
    docDefinition.content.push({
      columns: detailColumns.map((column) => ({
        stack: column,
        width: "*",
      })),
      columnGap: 10,
      margin: [0, 10, 0, 10],
    });
  }
}

/**
 * Add items table
 */
function addItemsTable(docDefinition, section, invoice) {
  if (!invoice.items || invoice.items.length === 0) {
    return;
  }

  // Create table headers based on columns
  const tableHeaders = section.columns.map((col) => ({
    text: col.placeholder || col.key,
    style: "tableHeader",
    alignment: col.alignment || "left",
  }));

  // Create table body rows from invoice items
  const tableBody = invoice.items.map((item) => {
    return section.columns.map((col) => ({
      text: item[col.key] || "-",
      alignment: col.alignment || "left",
      bold: col.bold || false,
    }));
  });

  // Combine headers and body
  const tableData = [tableHeaders, ...tableBody];

  // Define table layout
  let layout = "lightHorizontalLines";
  if (section.tableStyle) {
    if (section.tableStyle.border) {
      layout = "noBorders";
    }
    if (section.tableStyle.layout) {
      layout = section.tableStyle.layout;
    }
  }

  docDefinition.content.push({
    table: {
      headerRows: 1,
      widths: section.columns.map((col) => "*"),
      body: tableData,
    },
    layout: layout,
    margin: [0, 10, 0, 10],
  });
}

/**
 * Add totals section
 */
function addTotals(docDefinition, section, invoice) {
  const totalsData = [];

  // Subtotal row
  if (invoice.subtotal) {
    totalsData.push([
      { text: "Sub Total:", alignment: "right" },
      { text: invoice.subtotal, alignment: "right" },
    ]);
  }

  // Deductions
  if (invoice.deductions && invoice.deductions.length > 0) {
    invoice.deductions.forEach((deduct) => {
      if (deduct.description && deduct.amount) {
        totalsData.push([
          { text: deduct.description, alignment: "right" },
          { text: deduct.amount, alignment: "right" },
        ]);
      }
    });
  }

  // Additions
  if (invoice.additions && invoice.additions.length > 0) {
    invoice.additions.forEach((add) => {
      if (add.description && add.amount) {
        totalsData.push([
          { text: add.description, alignment: "right" },
          { text: add.amount, alignment: "right" },
        ]);
      }
    });
  }

  // Total amount row
  if (invoice.totalAmount) {
    totalsData.push([
      { text: "Total", alignment: "right", bold: true },
      { text: invoice.totalAmount, alignment: "right", bold: true },
    ]);
  }

  if (totalsData.length > 0) {
    docDefinition.content.push({
      layout: "noBorders",
      table: {
        widths: ["*", 100],
        body: totalsData,
      },
      style: "totalsTable",
      margin: [0, 10, 0, 10],
    });
  }
}

/**
 * Add notes or payment instructions section
 */
function addNotesSection(docDefinition, section, invoice) {
  const content = [];

  if (section.title) {
    content.push({
      text: section.title,
      style: "subheader",
    });
  }

  section.fields.forEach((field) => {
    if (invoice[field.key] && invoice[field.key] !== "") {
      const fieldLabel = field.value ? "" : field.placeholder;
      const fieldText = fieldLabel
        ? `${fieldLabel}${invoice[field.key]}`
        : invoice[field.key];

      content.push({
        text: fieldText,
        bold: field.bold,
        fontSize: field.size,
        margin: [0, 2, 0, 0],
      });
    }
  });

  if (content.length > 0) {
    docDefinition.content.push({
      stack: content,
      margin: [0, 10, 0, 10],
    });
  }
}

/**
 * Generate and download the PDF
 */
function downloadInvoicePdf(invoice, template, filename = "invoice.pdf") {
  const docDefinition = generateInvoicePdf(invoice, template);
  pdfMake.createPdf(docDefinition).download(filename);
}

/**
 * Open the PDF in a new browser tab
 */
function openInvoicePdf(invoice, template) {
  const docDefinition = generateInvoicePdf(invoice, template);
  pdfMake.createPdf(docDefinition).open();
}

/**
 * Get a data URL for the PDF
 */
async function getInvoicePdfDataUrl(invoice, template) {
  return new Promise((resolve) => {
    const docDefinition = generateInvoicePdf(invoice, template);
    pdfMake.createPdf(docDefinition).getDataUrl((dataUrl) => {
      resolve(dataUrl);
    });
  });
}

// Example usage:
// const template = {...}; // Your template configuration
// const invoice = {
//   businessName: "Example Corp",
//   businessAddress: "123 Main St",
//   clientName: "John Doe",
//   invoiceNumber: "INV-001",
//   issuedAt: "2025-04-26",
//   items: [
//     { description: "Web Development", quantity: "1", rate: "1000", total: "1000" }
//   ],
//   subtotal: "1000",
//   totalAmount: "1000"
// };
//
// downloadInvoicePdf(invoice, template);

export {
  generateInvoicePdf,
  downloadInvoicePdf,
  openInvoicePdf,
  getInvoicePdfDataUrl,
};
