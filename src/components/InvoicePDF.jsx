import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";

// Styles for the PDF
const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12 },
  section: { marginBottom: 10 },
  header: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
  },
  tableRow: { flexDirection: "row" },
  tableCol: {
    width: "25%",
    padding: 5,
    borderRightWidth: 1,
    borderBottomWidth: 1,
  },
  tableHeader: { fontWeight: "bold", backgroundColor: "#eee" },
  total: {
    marginTop: 10,
    textAlign: "right",
    fontSize: 14,
    fontWeight: "bold",
  },
});

// InvoicePDF Component
const InvoicePDF = ({ invoice }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Business & Client Info */}
      <View style={styles.section}>
        <Text style={styles.header}>
          {invoice.businessName || "Your Business"}
        </Text>
        <Text>{invoice.businessAddress || "Business Address"}</Text>
      </View>
      <View style={styles.section}>
        <Text>Invoice No: {invoice.invoiceNumber || "INV-0001"}</Text>
        <Text>Issued At: {invoice.issuedAt || "2025-03-20"}</Text>
        <Text>Client: {invoice.clientName || "John Doe"}</Text>
      </View>

      {/* Items Table */}
      <View style={[styles.table, { marginTop: 10 }]}>
        {/* Table Header */}
        <View style={[styles.tableRow, styles.tableHeader]}>
          {["Description", "Qty", "Unit Price", "Total"].map((text) => (
            <Text key={text} style={styles.tableCol}>
              {text}
            </Text>
          ))}
        </View>
        {/* Table Rows */}
        {invoice.items?.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCol}>{item.description || "-"}</Text>
            <Text style={styles.tableCol}>{item.quantity || "-"}</Text>
            <Text style={styles.tableCol}>${item.unitPrice || "-"}</Text>
            <Text style={styles.tableCol}>${item.total || "-"}</Text>
          </View>
        ))}
      </View>

      {/* Total Amount */}
      <Text style={styles.total}>Total: ${invoice.totalAmount || "0.00"}</Text>
    </Page>
  </Document>
);

export default InvoicePDF;
