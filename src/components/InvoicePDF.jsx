"use client";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const createStyles = (template) =>
  StyleSheet.create({
    page: { padding: 30, fontSize: 12 },
    section: { marginBottom: 10 },
    table: {
      display: "table",
      width: "100%",
      borderStyle: "solid",
      borderWidth: 1,
    },
    row: { flexDirection: "row" },
    col: {
      width: "25%",
      padding: 5,
      borderRightWidth: 1,
      borderBottomWidth: 1,
    },
    bold: { fontWeight: "bold" },
    italic: { fontStyle: "italic" },
    uppercase: { textTransform: "uppercase" },
    alignRight: { textAlign: "right" },
    alignLeft: { textAlign: "left" },
    alignCenter: { textAlign: "center" },
  });

const getTextStyle = (section, styles) => [
  section.bold && styles.bold,
  section.italic && styles.italic,
  section.uppercase && styles.uppercase,
  section.alignment === "right" && styles.alignRight,
  section.alignment === "center" && styles.alignCenter,
];

const InvoicePDF = ({ template, invoice }) => {
  const styles = createStyles(template);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {template.structure.map((section) => (
          <View
            key={section.section}
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              // marginBottom: 10,
            }}
          >
            {section.columns &&
              section.columns?.map((col, colIndex) => (
                <View key={colIndex} style={{ marginBottom: 10 }}>
                  {col.fields?.map((field) =>
                    field === "businessLogo" ? (
                      <Image
                        key={field}
                        src={invoice[field]}
                        style={{
                          height: 40,
                          width: "auto",
                          objectFit: "contain",
                        }} // Adjust size as needed
                      />
                    ) : (
                      <View key={field} style={{}}>
                        <Text>{invoice[field]}</Text>
                      </View>
                    )
                  )}
                </View>
              ))}

            {section.fields && (
              <View style={{ marginBottom: 10 }}>
                {section.fields?.map((field) => {
                  const value = invoice[field];

                  if (!value) return null;

                  return (
                    <Text key={field} style={styles.text}>
                      {value}
                    </Text>
                  );
                })}
              </View>
            )}

            {section.section === "logo" && null}
            {section.section === "horizontal-line" && (
              <View
                style={{ borderBottom: "5px solid #000", marginVertical: 5 }}
              />
            )}
            {section.section === "items" && (
              <View style={[styles.table, { marginTop: 10, marginBottom: 10 }]}>
                <View style={styles.row}>
                  {section.columns.map((col) => (
                    <Text key={col} style={[styles.col, styles.bold]}>
                      {col.charAt(0).toUpperCase() + col.slice(1)}
                    </Text>
                  ))}
                </View>
                {invoice.items.map((item, index) => (
                  <View key={index} style={styles.row}>
                    {section.columns.map((col) => (
                      <Text key={col} style={styles.col}>
                        {item[col] ?? "-"}
                      </Text>
                    ))}
                  </View>
                ))}
              </View>
            )}

            {/* Totals Section */}
            {section.section === "totals" && (
              <View>
                <Text
                  style={[
                    styles.textRight,
                    styles.bold,
                    { marginVertical: 10 },
                  ]}
                >
                  {template.labels?.subtotal || "Subtotal"}: {invoice.subtotal}
                </Text>

                {invoice.deductions?.map((deduct, index) => (
                  <Text key={index} style={[styles.textRight, styles.redText]}>
                    {deduct.description} -{deduct.amount}
                  </Text>
                ))}

                {invoice.additions?.map((add, index) => (
                  <Text
                    key={index}
                    style={[styles.textRight, styles.greenText]}
                  >
                    {add.description} +{add.amount}
                  </Text>
                ))}

                <Text style={[styles.textRight, styles.bold]}>
                  {template.labels?.totalAmount || "Total"}:{" "}
                  {invoice.totalAmount}
                </Text>
              </View>
            )}
          </View>
        ))}
      </Page>
    </Document>
  );
};

export default InvoicePDF;
