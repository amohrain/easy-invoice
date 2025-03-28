// Each section can have styles propety

export const templates = [
  {
    id: "1",
    name: "Standard Business Invoice",
    structure: [
      {
        section: "logo",
        alignment: "right",
      },
      {
        section: "header",
        alignment: "right",
        bold: true,
        fontSize: 16,
        uppercase: true,
        backgroundColor: "#f8f8f8",
        fields: [
          "businessName",
          "businessAddress",
          "businessEmail",
          "businessPhone",
        ],
      },
      {
        section: "clientDetails",

        alignment: "left",
        fields: [
          "clientName",
          "clientEmail",
          "clientPhone",
          "clientAddress",
          "clientTaxId",
        ],
      },
      {
        section: "invoiceDetails",

        alignment: "left",
        fields: ["invoiceNumber", "issuedAt", "dueDate", "paymentTerms"],
      },
      {
        section: "items",
        alignment: "left",
        columns: ["description", "quantity", "unitPrice", "total"],
      },
      {
        section: "totals",

        alignment: "right",
      },
      {
        section: "footer",

        alignment: "center",
        fields: ["notes", "paymentInstructions"],
      },
    ],
    labels: {
      businessName: "BIZ: ",
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
  {
    id: "2",
    name: "Standard Business Invoice",
    structure: [
      {
        section: "logo",
        alignment: "center",
      },
      {
        section: "header",
        alignment: "right",
        bold: true,
        fontSize: 16,
        uppercase: true,
        backgroundColor: "#f8f8f8",
        fields: [
          "businessName",
          "businessAddress",
          "businessEmail",
          "businessPhone",
        ],
      },
      { section: "horizontal-line" },
      {
        section: "clientDetails",

        alignment: "left",
        fields: [
          "clientName",
          "clientEmail",
          "clientPhone",
          "clientAddress",
          "clientTaxId",
        ],
      },
      {
        section: "invoiceDetails",

        alignment: "left",
        fields: ["invoiceNumber", "issuedAt", "dueDate", "paymentTerms"],
      },
      { section: "space" },
      {
        section: "items",

        alignment: "left",
        columns: ["description", "quantity", "unitPrice", "total"],
      },
      { section: "break" },
      {
        section: "totals",

        alignment: "right",
      },
      {
        section: "footer",
        alignment: "center",
        fields: ["notes", "paymentInstructions"],
        styles: {
          marginBottom: 10,
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
  // {
  //   id: "3",
  //   name: "Standard Business Invoice",
  //   structure: [
  //     {
  //       section: "header",
  //       alignment: "right",
  //       bold: true,
  //       fontSize: 16,
  //       uppercase: true,
  //       backgroundColor: "#f8f8f8",
  //       fields: [
  //         "businessName",
  //         "businessAddress",
  //         "businessEmail",
  //         "businessPhone",
  //         "businessLogo",
  //       ],
  //     },
  //     { section: "horizontal-line" },
  //     {
  //       section: "clientDetails",

  //       alignment: "left",
  //       fields: [
  //         "clientName",
  //         "clientEmail",
  //         "clientPhone",
  //         "clientAddress",
  //         "clientTaxId",
  //       ],
  //     },
  //     {
  //       section: "invoiceDetails",

  //       alignment: "left",
  //       fields: ["invoiceNumber", "issuedAt", "dueDate", "paymentTerms"],
  //     },
  //     { section: "space" },
  //     { section: "title",  alignment: "center" },
  //     {
  //       section: "items",

  //       alignment: "left",
  //       columns: ["description", "quantity", "unitPrice", "total"],
  //     },
  //     { section: "break" },
  //     {
  //       section: "totals",

  //       alignment: "right",
  //       // fields: ["subtotal", "deductions", "additions", "totalAmount"], // removed to prevent duplications
  //     },
  //     {
  //       section: "footer",

  //       alignment: "center",
  //       fields: ["notes", "paymentInstructions"],
  //     },
  //   ],
  //   labels: {
  //     title: "Invoice",
  //     businessName: "Company: ",
  //     businessAddress: "Address: ",
  //     businessEmail: "Email: ",
  //     businessPhone: "Phone: ",
  //     businessLogo: "",
  //     clientName: "Bill to: ",
  //     clientEmail: "Email: ",
  //     clientPhone: "Phone: ",
  //     clientAddress: "Address: ",
  //     clientTaxId: "",
  //     invoiceNumber: "Inv. No.: ",
  //     issuedAt: "Issue Date: ",
  //     dueDate: "Due Date: ",
  //     paymentTerms: "Payment terms: ",
  //     subtotal: "Sub total",
  //     tax: "Add tax: ",
  //     discount: "Less: discount: ",
  //     totalAmount: "Total: ",
  //     notes: "Notes: ",
  //     paymentInstructions: "Payment instructions: ",
  //   },
  // },
  {
    id: "4",
    name: "Standard Business Invoice",
    structure: [
      {
        section: "header",
        alignment: "right",
        bold: true,
        fontSize: 16,
        uppercase: true,
        backgroundColor: "#f8f8f8",
        columns: [
          {
            alignment: "left",
            fields: ["businessLogo"],
          },
          {
            alignment: "right",
            fields: [
              "businessName",
              "businessAddress",
              "businessEmail",
              "businessPhone",
            ],
          },
        ],
      },
      { section: "horizontal-line" },
      {
        section: "clientDetails",

        alignment: "left",
        fields: [
          "clientName",
          "clientEmail",
          "clientPhone",
          "clientAddress",
          "clientTaxId",
        ],
      },
      {
        section: "invoiceDetails",

        alignment: "left",
        columns: [
          {
            alignment: "left",
            fields: ["invoiceNumber", "issuedAt"],
          },
          {
            alignment: "right",
            fields: ["dueDate", "paymentTerms"],
          },
        ],
      },
      { section: "space" },
      {
        section: "items",

        alignment: "left",
        columns: ["description", "quantity", "unitPrice", "total"],
      },
      { section: "break" },
      {
        section: "totals",

        alignment: "right",
        // fields: ["subtotal", "deductions", "additions", "totalAmount"], // removed to prevent duplications
      },
      {
        section: "footer",
        alignment: "center",
        fields: ["notes", "paymentInstructions"],
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
