import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 50,
    marginBottom: 20,
  },
  invoiceInfo: {
    textAlign: "right",
  },
  section: {
    marginBottom: 10,
  },
  columns: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  column: {
    width: "48%",
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingBottom: 5,
    marginBottom: 5,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 5,
  },
  tableCell: {
    width: "33%",
  },
});

const InvoiceDocument = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header with logo and invoice details */}
      <View style={styles.header}>
        <Image style={styles.logo} src="./chanel-1.jpg" />
        <Image style={styles.logo} src="./chanel-1.jpg" />
        <View style={styles.invoiceInfo}>
          <Text>Invoice #12345</Text>
          <Text>Date: 2025-03-28</Text>
        </View>
      </View>

      {/* Billing information */}
      <View style={styles.section}>
        <Text>Bill To:</Text>
        <Text>John Doe</Text>
        <Text>123 Main Street</Text>
        <Text>City, Country</Text>
      </View>

      {/* Payment method and due date in columns */}
      <View style={styles.columns}>
        <View style={styles.column}>
          <Text>Payment Method:</Text>
          <Text>Credit Card</Text>
        </View>
        <View style={styles.column}>
          <Text>Due Date:</Text>
          <Text>2025-04-05</Text>
        </View>
      </View>

      {/* Table header */}
      <View style={styles.tableHeader}>
        <Text style={styles.tableCell}>Description</Text>
        <Text style={styles.tableCell}>Quantity</Text>
        <Text style={styles.tableCell}>Price</Text>
      </View>

      {/* Table rows */}
      <View style={styles.tableRow}>
        <Text style={styles.tableCell}>Service 1</Text>
        <Text style={styles.tableCell}>1</Text>
        <Text style={styles.tableCell}>$100.00</Text>
      </View>
      <View style={styles.tableRow}>
        <Text style={styles.tableCell}>Service 2</Text>
        <Text style={styles.tableCell}>2</Text>
        <Text style={styles.tableCell}>$200.00</Text>
      </View>

      {/* Footer notes and total amount in columns */}
      <View style={styles.columns}>
        <View style={styles.column}>
          <Text>Notes:</Text>
          <Text>Thank you for your business!</Text>
        </View>
        <View style={styles.column}>
          <Text>Total:</Text>
          <Text>$500.00</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default InvoiceDocument;
