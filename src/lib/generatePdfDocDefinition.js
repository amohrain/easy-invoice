export function generatePdfDocDefinition(template, invoice) {
  const content = [];

  template.structure.forEach(async (section) => {
    // Title
    if (section.title) {
      content.push({
        text: section.title,
        style: section.style,
        bold: true,
        margin: [0, 10, 0, 0],
      });
    }
    // Horizontal line
    if (section.section === "horizontal-line") {
      content.push({
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 20,
            x2: 520,
            y2: 20,
            lineWidth: 2,
            marginbottom: 20,
          },
        ],
      });
      return;
    }

    // Logo
    if (section.section === "logo" && invoice.businessLogo) {
      content.push({
        image: invoice.businessLogo,
        fit: [50, 50],
        style: section.style,
        // margin: [0, 0, 0, 0],
      });
      return;
    }

    // Columns (e.g. header)
    if (section.columns) {
      const cols = section.columns.map((col) => {
        const fieldTexts = col.fields
          ?.map((field) => {
            if (field === "businessLogo") {
              return {
                image: invoice.businessLogo,
                fit: [50, 50],
                alignment: col.style?.alignment || "left",
                // margin: [0, 0, 0, 0],
              };
            }

            const val = invoice[field];
            // || template.labels?.[field] || field;
            return {
              text: val,
              style: col.style || {},
              bold: !invoice[field],
              marginbottom:
                field === col.fields?.[col.fields.length - 1] // last field
                  ? 10
                  : 0,
            };
          })
          .filter((item) => item?.text || item?.image);

        return {
          stack: fieldTexts?.length ? fieldTexts : [{ text: " " }],
          width: "*",
        };
      });

      content.push({ columns: cols, columnGap: 10 });
      return;
    }

    // Items Table

    if (section.section === "items") {
      const tableBody = [
        section.items.map((col) => ({
          text: col.charAt(0).toUpperCase() + col.slice(1),
          bold: true,
        })),
        ...invoice.items.map((item) =>
          section.items.map((col) => ({
            text: item[col]?.toString() || "-",
          }))
        ),
      ];

      content.push({
        table: {
          headerRows: 1,
          widths: section.items.map((col) =>
            col === "description" ? "*" : "auto"
          ),

          //   widths: Array(section.items.length).fill("*"),
          body: tableBody,
        },
        layout: "headerLineOnly",
        margin: [0, 10, 0, 10],
      });

      return;
    }

    // Totals
    if (section.section === "totals") {
      const totals = [];

      totals.push({
        text: `${template.labels?.subtotal || "Subtotal"}: ${
          invoice.currencySymbol
        }${invoice.subtotal || 0}`,
        style: section.style || {},
      });

      invoice.deductions?.forEach((d) => {
        totals.push({
          text: `${d.description} -${invoice.currencySymbol}${d.amount}`,
          style: section.style || {},
        });
      });

      invoice.additions?.forEach((a) => {
        totals.push({
          text: `${a.description} +${invoice.currencySymbol}${a.amount}`,
          style: section.style || {},
        });
      });

      totals.push({
        text: `${template.labels?.totalAmount || "Total"} ${
          invoice.currencySymbol
        }${invoice.totalAmount || 0}`,
        bold: true,
        style: section.style || {},
        margin: [0, 10, 0, 10],
      });

      content.push(...totals);
      return;
    }

    // Fields
    if (section.fields) {
      content.push(
        section.fields.map((field) => {
          return {
            text: invoice[field] || "",
            style: section.style || {},
            bold: !invoice[field],
            marginBottom:
              field === section.fields?.[section.fields.length - 1] ? 10 : 0,
          };
        })
      );
    }
  });

  return {
    content,
    styles: {
      header: { fontSize: 18, bold: true },
      subheader: { fontSize: 14, bold: true },
      small: { fontSize: 14 },
    },
    defaultStyle: {
      fontSize: 14,
      margin: [0, 10],
    },
  };
}
