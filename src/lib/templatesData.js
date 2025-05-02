// Each section can have styles propety

export const templates = [
  {
    isPublic: true,
    name: "Vibe",
    style: {
      defaultStyle: {
        size: 12,
        fontColor: "content",
      },
      colors: {
        content: "#111111",
        primary: "#ebebeb",
        accent: "#ebebeb",
      },
      // borders: {
      //   margins: 5,
      //   lineWidth: 1,
      //   radius: 0,
      //   color: "primary",
      // },
    },
    structure: [
      {
        section: "title",
        style: {
          bold: true,
          size: 18,
          alignment: "center",
        },
      },
      {
        section: "header",
        columns: [
          {
            fields: [],
            style: {
              alignment: "left",
            },
          },
          {
            fields: [
              {
                key: "businessLogo",
                placeholder: "",
                value: false,
                bold: false,
                size: 12,
              },
              {
                key: "businessName",
                placeholder: "Company: ",
                value: false,
                bold: true,
                size: 20,
              },
              {
                key: "businessAddress",
                placeholder: "Address: ",
                value: false,
                bold: false,
                size: 12,
              },
              {
                key: "businessEmail",
                placeholder: "Email: ",
                value: false,
                bold: false,
                size: 12,
              },
              {
                key: "businessPhone",
                placeholder: "Phone: ",
                value: false,
                bold: false,
                size: 12,
              },
            ],
            style: {
              alignment: "right",
            },
          },
        ],
        style: {
          alignment: "right",
          uppercase: true,
          fontSize: 16,
        },
      },
      {
        section: "horizontal-line",
        style: {
          color: "primary",
        },
      },
      {
        section: "clientDetails",
        title: "Bill to",
        style: {
          alignment: "left",
          size: 14,
        },
        fields: [
          {
            key: "clientName",
            placeholder: "Bill to: ",
            value: false,
            bold: true,
            size: 12,
          },
          {
            key: "clientAddress",
            placeholder: "Address: ",
            value: false,
            bold: false,
            size: 12,
          },
          {
            key: "clientEmail",
            placeholder: "Email: ",
            value: false,
            bold: false,
            size: 12,
          },
          {
            key: "clientPhone",
            placeholder: "Phone: ",
            value: false,
            bold: false,
            size: 12,
          },
          {
            key: "clientTaxId",
            placeholder: "",
            value: false,
            bold: false,
            size: 12,
          },
        ],
      },
      {
        section: "invoiceDetails",
        columns: [
          {
            style: {
              alignment: "left",
            },
            fields: [
              {
                key: "invoiceNumber",
                placeholder: "Inv. No.: ",
                value: true,
                bold: false,
                size: 12,
              },
              {
                key: "issuedAt",
                placeholder: "Issue Date: ",
                value: true,
                bold: false,
                size: 12,
              },
            ],
          },
          {
            style: {
              alignment: "right",
            },
            fields: [
              {
                key: "dueDate",
                placeholder: "Due Date: ",
                value: true,
                bold: false,
                size: 12,
              },
              {
                key: "amountDue",
                placeholder: "Amount due: ",
                amount: true,
                value: true,
                bold: false,
                size: 12,
              },
            ],
          },
        ],
      },
      { section: "space" },
      {
        section: "items",
        tableStyle: {
          borderStyle: "headerLineOnly", // main style
          borderColor: "primary",
          border: true, // Just keeping for now for DOM's sake
          // cellPadding: 4,

          // Fine-grained overrides
          // outsideBorders: true,
          // insideVerticalBorders: true,
          // insideHorizontalBorders: true,
          // headerHorizontalBorder: true,
        },
        items: [
          {
            key: "description",
            placeholder: "Description",
            bold: false,
            alignment: "left",
            size: 12,
            border: true,
          },
          {
            key: "quantity",
            placeholder: "Quantity",
            bold: false,
            alignment: "center",
            size: 12,
          },
          {
            key: "rate",
            placeholder: "Rate",
            bold: false,
            alignment: "center",
            size: 12,
          },
          {
            key: "total",
            placeholder: "Total",
            bold: true,
            alignment: "center",
            size: 12,
          },
        ],
      },

      { section: "break" },
      {
        section: "totals",
        style: {
          borderColor: "primary",
          borderWidth: 1,
          alignment: "right",
        },
      },
      {
        section: "notes",
        title: "Notes",
        fields: [
          {
            key: "notes",
            placeholder: "Notes: ",
            value: false,
            bold: false,
            size: 12,
          },
        ],
        style: {
          alignment: "left",
        },
      },
      {
        section: "Payment instructions",
        title: "Payment Instructions:",
        fields: [
          {
            key: "paymentInstructions",
            placeholder: "Payment instructions: ",
            value: false,
            bold: false,
            size: 12,
          },
        ],
        style: {
          alignment: "left",
        },
      },
    ],
  },
];
