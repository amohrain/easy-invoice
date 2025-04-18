// Each section can have styles propety

export const templates = [
  // {
  //   id: "1",
  //   name: "Standard Business Invoice",
  //   structure: [
  //     {
  //       section: "logo",
  //       alignment: "right",
  //     },
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
  //       ],
  //     },
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
  //     {
  //       section: "items",
  //       alignment: "left",
  //       columns: ["description", "quantity", "rate", "total"],
  //     },
  //     {
  //       section: "totals",

  //       alignment: "right",
  //     },
  //     {
  //       section: "footer",

  //       alignment: "center",
  //       fields: ["notes", "paymentInstructions"],
  //     },
  //   ],
  //   labels: {
  //     businessName: "BIZ: ",
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
  // {
  //   id: "2",
  //   name: "Standard Business Invoice",
  //   structure: [
  //     {
  //       section: "logo",
  //       alignment: "center",
  //     },
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
  //     {
  //       section: "items",

  //       alignment: "left",
  //       columns: ["description", "quantity", "rate", "total"],
  //     },
  //     { section: "break" },
  //     {
  //       section: "totals",

  //       alignment: "right",
  //     },
  //     {
  //       section: "footer",
  //       alignment: "center",
  //       fields: ["notes", "paymentInstructions"],
  //       styles: {
  //         marginBottom: 10,
  //       },
  //     },
  //   ],
  //   labels: {
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
  //       columns: ["description", "quantity", "rate", "total"],
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
          bold: true,
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
          bold: true,
        },
      },
      {
        section: "footer",
        fields: ["notes", "paymentInstructions"],
        style: {
          alignment: "left",
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
