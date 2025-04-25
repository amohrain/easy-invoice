// Each section can have styles propety

export const templates = [
  // {
  //   id: "1",
  //   name: "Modern Business Invoice",
  //   fontSize: 12,
  //   structure: [
  //     {
  //       section: "header",
  //       columns: [
  //         {
  //           style: {
  //             alignment: "left",
  //           },
  //           fields: ["businessLogo"],
  //         },
  //         {
  //           style: {
  //             alignment: "right",
  //             bold: true,
  //             fontSize: 18,
  //           },
  //           fields: [
  //             "businessName",
  //             "businessAddress",
  //             "businessEmail",
  //             "businessPhone",
  //           ],
  //         },
  //       ],
  //     },
  //     { section: "horizontal-line", style: { color: "#3498db", thickness: 2 } },
  //     {
  //       section: "invoiceDetails",
  //       columns: [
  //         {
  //           style: {
  //             alignment: "left",
  //             bold: true,
  //             fontSize: 16,
  //           },
  //           fields: ["invoiceNumber"],
  //         },
  //         {
  //           style: {
  //             alignment: "right",
  //           },
  //           fields: ["issuedAt", "dueDate", "paymentTerms"],
  //         },
  //       ],
  //     },
  //     { section: "space" },
  //     {
  //       section: "clientDetails",
  //       style: {
  //         alignment: "left",
  //         background: "#f8f9fa",
  //         padding: 15,
  //         borderRadius: 5,
  //       },
  //       fields: [
  //         "clientName",
  //         "clientEmail",
  //         "clientPhone",
  //         "clientAddress",
  //         "clientTaxId",
  //       ],
  //     },
  //     { section: "space" },
  //     {
  //       section: "items",
  //       style: {
  //         alignment: "left",
  //         headerBackground: "#3498db",
  //         headerColor: "#ffffff",
  //         alternateRowColor: "#f8f9fa",
  //       },
  //       columns: ["description", "quantity", "rate", "total"],
  //       items: ["description", "quantity", "rate", "total"],
  //     },
  //     { section: "break" },
  //     {
  //       section: "totals",
  //       style: {
  //         alignment: "right",
  //         bold: true,
  //         fontSize: 14,
  //         background: "#f8f9fa",
  //         padding: 10,
  //         borderRadius: 5,
  //       },
  //     },
  //     { section: "horizontal-line", style: { color: "#3498db", thickness: 1 } },
  //     {
  //       section: "footer",
  //       fields: ["notes", "paymentInstructions"],
  //       style: {
  //         alignment: "center",
  //         fontSize: 11,
  //         color: "#555555",
  //       },
  //     },
  //   ],
  //   labels: {
  //     businessName: "",
  //     businessAddress: "",
  //     businessEmail: "Email: ",
  //     businessPhone: "Phone: ",
  //     businessLogo: "",
  //     clientName: "BILL TO:",
  //     clientEmail: "Email: ",
  //     clientPhone: "Phone: ",
  //     clientAddress: "Address: ",
  //     clientTaxId: "Tax ID: ",
  //     invoiceNumber: "INVOICE #",
  //     issuedAt: "Issue Date: ",
  //     dueDate: "Due Date: ",
  //     paymentTerms: "Terms: ",
  //     subtotal: "Subtotal",
  //     tax: "Tax",
  //     discount: "Discount",
  //     totalAmount: "TOTAL DUE",
  //     notes: "Notes",
  //     paymentInstructions: "Payment Instructions",
  //   },
  // },
  // {
  //   id: "2",
  //   name: "Minimalist Invoice",
  //   fontSize: 11,
  //   structure: [
  //     {
  //       section: "header",
  //       columns: [
  //         {
  //           style: {
  //             alignment: "left",
  //           },
  //           fields: ["businessLogo"],
  //         },
  //         {
  //           style: {
  //             alignment: "right",
  //             fontFamily: "Helvetica",
  //             fontSize: 20,
  //             bold: true,
  //           },
  //           fields: ["businessName"],
  //         },
  //       ],
  //     },
  //     { section: "space" },
  //     {
  //       section: "businessDetails",
  //       style: {
  //         alignment: "right",
  //         fontSize: 10,
  //         color: "#666666",
  //       },
  //       fields: ["businessAddress", "businessEmail", "businessPhone"],
  //     },
  //     { section: "horizontal-line", style: { color: "#eeeeee", thickness: 1 } },
  //     {
  //       section: "documentTitle",
  //       style: {
  //         alignment: "left",
  //         bold: true,
  //         fontSize: 24,
  //         fontFamily: "Helvetica",
  //       },
  //       fields: ["invoiceNumber"],
  //     },
  //     {
  //       section: "invoiceDates",
  //       columns: [
  //         {
  //           style: {
  //             alignment: "left",
  //           },
  //           fields: ["issuedAt", "dueDate"],
  //         },
  //         {
  //           style: {
  //             alignment: "right",
  //           },
  //           fields: ["paymentTerms"],
  //         },
  //       ],
  //     },
  //     { section: "space" },
  //     {
  //       section: "clientDetails",
  //       style: {
  //         alignment: "left",
  //         fontSize: 11,
  //       },
  //       fields: [
  //         "clientName",
  //         "clientAddress",
  //         "clientEmail",
  //         "clientPhone",
  //         "clientTaxId",
  //       ],
  //     },
  //     { section: "space" },
  //     {
  //       section: "items",
  //       style: {
  //         alignment: "left",
  //         headerBackground: "#ffffff",
  //         headerColor: "#000000",
  //         headerBorderBottom: true,
  //         footerBorderTop: true,
  //       },
  //       columns: ["description", "quantity", "rate", "total"],
  //       items: ["description", "quantity", "rate", "total"],
  //     },
  //     { section: "break" },
  //     {
  //       section: "totals",
  //       style: {
  //         alignment: "right",
  //         bold: true,
  //       },
  //     },
  //     { section: "space" },
  //     {
  //       section: "footer",
  //       fields: ["notes", "paymentInstructions"],
  //       style: {
  //         alignment: "left",
  //         fontSize: 10,
  //         color: "#666666",
  //       },
  //     },
  //   ],
  //   labels: {
  //     businessName: "",
  //     businessAddress: "",
  //     businessEmail: "",
  //     businessPhone: "",
  //     businessLogo: "",
  //     clientName: "Bill To",
  //     clientEmail: "",
  //     clientPhone: "",
  //     clientAddress: "",
  //     clientTaxId: "",
  //     invoiceNumber: "Invoice",
  //     issuedAt: "Issued: ",
  //     dueDate: "Due: ",
  //     paymentTerms: "Terms: ",
  //     subtotal: "Subtotal",
  //     tax: "Tax",
  //     discount: "Discount",
  //     totalAmount: "Total Due",
  //     notes: "Notes",
  //     paymentInstructions: "Payment Details",
  //   },
  // },
  // {
  //   id: "3",
  //   name: "Corporate Professional Invoice",
  //   fontSize: 11,
  //   structure: [
  //     {
  //       section: "header",
  //       style: {
  //         background: "#2c3e50",
  //         color: "#ffffff",
  //         padding: 20,
  //       },
  //       columns: [
  //         {
  //           style: {
  //             alignment: "left",
  //           },
  //           fields: ["businessLogo"],
  //         },
  //         {
  //           style: {
  //             alignment: "right",
  //             bold: true,
  //             fontSize: 22,
  //           },
  //           fields: ["businessName"],
  //         },
  //       ],
  //     },
  //     {
  //       section: "businessDetails",
  //       style: {
  //         alignment: "right",
  //         fontSize: 10,
  //       },
  //       fields: ["businessAddress", "businessEmail", "businessPhone"],
  //     },
  //     {
  //       section: "invoiceTitle",
  //       style: {
  //         alignment: "center",
  //         bold: true,
  //         fontSize: 18,
  //         margin: [0, 20, 0, 20],
  //       },
  //       fields: ["invoiceNumber"],
  //     },
  //     {
  //       section: "clientAndInvoiceDetails",
  //       columns: [
  //         {
  //           style: {
  //             alignment: "left",
  //             background: "#f5f5f5",
  //             padding: 15,
  //             borderRadius: 4,
  //           },
  //           fields: [
  //             "clientName",
  //             "clientAddress",
  //             "clientEmail",
  //             "clientPhone",
  //             "clientTaxId",
  //           ],
  //         },
  //         {
  //           style: {
  //             alignment: "right",
  //             background: "#f5f5f5",
  //             padding: 15,
  //             borderRadius: 4,
  //           },
  //           fields: ["issuedAt", "dueDate", "paymentTerms"],
  //         },
  //       ],
  //     },
  //     { section: "space" },
  //     {
  //       section: "items",
  //       style: {
  //         alignment: "left",
  //         headerBackground: "#2c3e50",
  //         headerColor: "#ffffff",
  //         fontSize: 10,
  //         lineHeight: 1.5,
  //       },
  //       columns: ["description", "quantity", "rate", "total"],
  //       items: ["description", "quantity", "rate", "total"],
  //     },
  //     { section: "break" },
  //     {
  //       section: "totals",
  //       style: {
  //         alignment: "right",
  //         bold: true,
  //         background: "#f5f5f5",
  //         padding: 10,
  //       },
  //     },
  //     { section: "horizontal-line", style: { color: "#2c3e50", thickness: 2 } },
  //     {
  //       section: "footer",
  //       fields: ["paymentInstructions", "notes"],
  //       style: {
  //         alignment: "center",
  //         fontSize: 10,
  //       },
  //     },
  //   ],
  //   labels: {
  //     businessName: "",
  //     businessAddress: "",
  //     businessEmail: "",
  //     businessPhone: "",
  //     businessLogo: "",
  //     clientName: "BILL TO:",
  //     clientEmail: "Email:",
  //     clientPhone: "Phone:",
  //     clientAddress: "Address:",
  //     clientTaxId: "Tax ID:",
  //     invoiceNumber: "INVOICE",
  //     issuedAt: "Issue Date:",
  //     dueDate: "Due Date:",
  //     paymentTerms: "Payment Terms:",
  //     subtotal: "Subtotal",
  //     tax: "Tax",
  //     discount: "Discount",
  //     totalAmount: "TOTAL",
  //     notes: "Additional Notes",
  //     paymentInstructions: "Payment Instructions",
  //   },
  // },
  {
    id: "4",
    name: "Columns Business Invoice",
    fontSize: 14,
    structure: [
      {
        section: "header",
        columns: [
          {
            fields: ["businessLogo"],
            style: {
              alignment: "left",
            },
          },
          {
            fields: [
              "businessName",
              "businessAddress",
              "businessEmail",
              "businessPhone",
            ],
            style: {
              alignment: "right",
            },
          },
        ],
        style: {
          alignment: "right",
          // bold: true,
          uppercase: true,
          fontSize: 16,
        },
      },
      { section: "horizontal-line" },
      {
        section: "clientDetails",
        title: "Bill to",
        style: {
          alignment: "left",
        },
        fields: [
          "clientName",
          "clientAddress",
          "clientPhone",
          "clientEmail",
          "clientTaxId",
        ],
      },

      {
        section: "invoiceDetails",
        columns: [
          {
            style: {
              alignment: "left",
            },
            fields: ["invoiceNumber", "issuedAt"],
          },
          {
            style: {
              alignment: "right",
            },
            fields: ["dueDate", "paymentTerms"],
          },
        ],
      },
      { section: "space" },
      {
        section: "items",

        style: {
          alignment: "left",
        },

        // columns: ["description", "quantity", "rate", "total"],
        items: ["description", "quantity", "rate", "total"],
      },
      { section: "break" },
      {
        section: "totals",
        style: {
          alignment: "right",
          // bold: true,
        },
      },
      {
        section: "notes",
        title: "Notes",
        fields: ["notes"],
        style: {
          alignment: "left",
        },
      },
      {
        section: "Payment instructions",
        title: "Payment Instructions:",
        fields: ["paymentInstructions"],
        style: {
          alignment: "left",
        },
      },
    ],
    labels: {
      // Labels can be array
      // First value is for Placeholder.
      // Second Value is whether to print on invoice
      // Third can be whether the field should be bold
      // Fourth can be font size of each label
      businessName: ["Company: ", false, true],
      businessAddress: ["Address: ", false, false],
      businessEmail: ["Email: ", false, false],
      businessPhone: ["Phone: ", false, false],
      businessLogo: ["", false, false],
      clientName: ["Bill to: ", false, true],
      clientEmail: ["Email: ", false, false],
      clientPhone: ["Phone: ", false, false],
      clientAddress: ["Address: ", false, false],
      clientTaxId: ["", false, false],
      invoiceNumber: ["Inv. No.: ", true, false],
      issuedAt: ["Issue Date: ", true, false],
      dueDate: ["Due Date: ", true, false],
      paymentTerms: ["Payment terms: ", true, false],
      subtotal: ["Sub Total: ", false, false],
      tax: ["Add tax: ", false, false],
      discount: ["Less: discount: ", false, false],
      totalAmount: ["Total: ", false, false],
      notes: ["Notes: ", false, false],
      paymentInstructions: ["Payment instructions: ", false, false],
    },
  },

  {
    id: "5",
    name: "Columns Business Invoice",
    fontSize: 14,
    structure: [
      {
        section: "logo",
        style: {
          alignment: "center",
        },
      },
      {
        section: "header",
        title: "",
        fields: [
          "businessName",
          "businessAddress",
          "businessEmail",
          "businessPhone",
        ],
        style: {
          alignment: "right",
        },
        style: {
          alignment: "right",
          bold: true,
          uppercase: true,
          fontSize: 16,
        },
      },
      { section: "horizontal-line" },
      {
        section: "clientDetails",

        style: {
          alignment: "left",
        },
        // fields: [
        //   "clientName",
        //   "clientEmail",
        //   "clientPhone",
        //   "clientAddress",
        //   "clientTaxId",
        // ],

        fields: [
          {
            field: "clientName",
            placeholder: "Client Name",
            value: "",
            bold: true,
            size: 14,
          },
          {
            field: "clientEmail",
            placeholder: "Client Email",
            value: "",
            bold: true,
            size: 14,
          },
          "clientPhone",
          "clientAddress",
          "clientTaxId",
        ],
      },
      {
        section: "invoiceDetails",
        columns: [
          {
            style: {
              alignment: "left",
            },
            fields: ["invoiceNumber"],
          },
          {
            style: {
              alignment: "left",
            },
            fields: ["issuedAt"],
          },
          {
            style: {
              alignment: "right",
            },
            fields: ["dueDate", "paymentTerms"],
          },
        ],
      },
      { section: "space" },
      {
        section: "items",

        style: {
          alignment: "left",
        },
        columns: ["description", "quantity", "rate", "total"],

        items: ["description", "quantity", "rate", "total"],
      },
      { section: "break" },
      {
        section: "totals",
        style: {
          alignment: "center",
          Something: false,
          bold: true,
        },
      },
      {
        section: "footer",
        fields: ["notes", "paymentInstructions"],
        style: {
          alignment: "center",
        },
      },
    ],
    labels: {
      businessName: "Company: ",
      businessAddress: "Address: ",
      businessEmail: "Email: ",
      businessPhone: "Phone: ",
      businessLogo: "",
      clientName: "Bill to: ",
      clientEmail: "Email: ",
      clientPhone: "Phone: ",
      clientAddress: "Address: ",
      clientTaxId: "",
      invoiceNumber: "Inv. No.: ",
      issuedAt: "Issue Date: ",
      dueDate: "Due Date: ",
      paymentTerms: "Payment terms: ",
      subtotal: "Sub total",
      tax: "Add tax: ",
      discount: "Less: discount: ",
      totalAmount: "Total: ",
      notes: "Notes: ",
      paymentInstructions: "Payment instructions: ",
    },
  },
];
