const template = {
  //   id: "one",
  name: "Easy Vibes",
  style: {
    defaultStyle: {
      size: 14,
      fontColor: "content",
    },
    colors: {
      content: "#111111",
      primary: "#ebebeb",
      accent: "#ebebeb",
    },
    borders: {
      margins: 5,
      lineWidth: 1,
      radius: 0,
      color: "primary",
    },
  },
  structure: [
    {
      section: "title",
      style: {
        bold: true,
        size: 22,
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
              size: 14,
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
              size: 14,
            },
            {
              key: "businessEmail",
              placeholder: "Email: ",
              value: true,
              bold: false,
              size: 14,
            },
            {
              key: "businessPhone",
              placeholder: "Phone: ",
              value: false,
              bold: false,
              size: 14,
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
      },
      fields: [
        {
          key: "clientName",
          placeholder: "Bill to: ",
          value: false,
          bold: true,
          size: 14,
        },
        {
          key: "clientAddress",
          placeholder: "Address: ",
          value: false,
          bold: false,
          size: 14,
        },
        {
          key: "clientPhone",
          placeholder: "Phone: ",
          value: false,
          bold: false,
          size: 14,
        },
        {
          key: "clientEmail",
          placeholder: "Email: ",
          value: false,
          bold: false,
          size: 14,
        },
        {
          key: "clientTaxId",
          placeholder: "",
          value: false,
          bold: false,
          size: 14,
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
              size: 14,
            },
            {
              key: "issuedAt",
              placeholder: "Issue Date: ",
              value: true,
              bold: false,
              size: 14,
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
              size: 14,
            },
            {
              key: "paymentTerms",
              placeholder: "Payment terms: ",
              value: true,
              bold: false,
              size: 14,
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
          size: 14,
          border: true,
        },
        {
          key: "quantity",
          placeholder: "Quantity",
          bold: false,
          alignment: "center",
          size: 14,
        },
        {
          key: "rate",
          placeholder: "Rate",
          bold: false,
          alignment: "center",
          size: 14,
        },
        {
          key: "total",
          placeholder: "Total",
          bold: true,
          alignment: "center",
          size: 14,
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
          size: 14,
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
          value: true,
          bold: false,
          size: 14,
        },
      ],
      style: {
        alignment: "right",
      },
    },
  ],
};

const response = await fetch("/api/templates", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": "762556b8-4c2f-4a0e-8d3b-1f5a7c6e9d3f",
  },
  body: JSON.stringify(template),
});

const data = await response.json();
console.log(data);
