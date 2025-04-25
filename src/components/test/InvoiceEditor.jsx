"use client";
import React, { useState, useEffect } from "react";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const InvoiceEditor = ({ invoiceData, templateData, onSave }) => {
  const [invoice, setInvoice] = useState(invoiceData);
  const [template, setTemplate] = useState(templateData);

  const handleFieldChange = (field, value) => {
    setInvoice((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...invoice.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: field === "quantity" || field === "rate" ? Number(value) : value,
    };

    // Recalculate total for this item
    if (field === "quantity" || field === "rate") {
      updatedItems[index].total =
        updatedItems[index].quantity * updatedItems[index].rate;
    }

    setInvoice((prev) => ({
      ...prev,
      items: updatedItems,
    }));

    // Recalculate subtotal
    recalculateTotals(updatedItems);
  };

  const recalculateTotals = (items) => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);

    // Apply deductions
    const deductionsTotal = invoice.deductions.reduce((sum, deduction) => {
      const amount = deduction.percent
        ? (subtotal * deduction.percent) / 100
        : deduction.amount;
      return sum + amount;
    }, 0);

    // Apply additions
    const additionsTotal = invoice.additions.reduce((sum, addition) => {
      const amount = addition.percent
        ? ((subtotal - deductionsTotal) * addition.percent) / 100
        : addition.amount;
      return sum + amount;
    }, 0);

    const totalAmount = subtotal - deductionsTotal + additionsTotal;

    setInvoice((prev) => ({
      ...prev,
      subtotal,
      totalAmount,
    }));
  };

  const addItem = () => {
    const newItems = [
      ...invoice.items,
      {
        description: "",
        quantity: 1,
        rate: 0,
        discount: 0,
        total: 0,
        _id: `temp-${Date.now()}`,
      },
    ];

    setInvoice((prev) => ({
      ...prev,
      items: newItems,
    }));
  };

  const removeItem = (index) => {
    const newItems = [...invoice.items];
    newItems.splice(index, 1);

    setInvoice((prev) => ({
      ...prev,
      items: newItems,
    }));

    recalculateTotals(newItems);
  };

  const handleSave = () => {
    onSave(invoice);
  };

  const renderField = (field, label, value) => {
    return (
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <input
          type="text"
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
          value={value || ""}
          onChange={(e) => handleFieldChange(field, e.target.value)}
        />
      </div>
    );
  };

  const renderSection = (section) => {
    switch (section.section) {
      case "header":
        return (
          <div className="flex justify-between items-start mb-6">
            {section.columns &&
              section.columns.map((column, colIndex) => (
                <div
                  key={colIndex}
                  className={`${colIndex === 0 ? "text-left" : "text-right"}`}
                >
                  {column.fields.map((field) => {
                    if (field === "businessLogo" && invoice.businessLogo) {
                      return (
                        <div key={field} className="mb-2">
                          <img
                            src={invoice.businessLogo}
                            alt="Business Logo"
                            className="h-16 object-contain"
                          />
                        </div>
                      );
                    }
                    return renderField(
                      field,
                      template.labels[field],
                      invoice[field]
                    );
                  })}
                </div>
              ))}
          </div>
        );

      case "horizontal-line":
        return <hr className="my-4 border-t border-gray-300" />;

      case "clientDetails":
        return (
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-2">{section.title}</h3>
            {section.fields.map((field) => (
              <div key={field}>
                {renderField(field, template.labels[field], invoice[field])}
              </div>
            ))}
          </div>
        );

      case "invoiceDetails":
        return (
          <div className="flex justify-between mb-6">
            {section.columns &&
              section.columns.map((column, colIndex) => (
                <div
                  key={colIndex}
                  className={colIndex === 0 ? "text-left" : "text-right"}
                >
                  {column.fields.map((field) => (
                    <div key={field}>
                      {renderField(
                        field,
                        template.labels[field],
                        invoice[field]
                      )}
                    </div>
                  ))}
                </div>
              ))}
          </div>
        );

      case "items":
        return (
          <div className="mb-6">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  {section.items.map((item) => (
                    <th
                      key={item}
                      className="p-2 text-left border border-gray-300"
                    >
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </th>
                  ))}
                  <th className="p-2 text-left border border-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={item._id || index}>
                    {section.items.map((field) => (
                      <td key={field} className="p-2 border border-gray-300">
                        <input
                          type={
                            field === "quantity" || field === "rate"
                              ? "number"
                              : "text"
                          }
                          className="w-full p-1"
                          value={item[field] || ""}
                          onChange={(e) =>
                            handleItemChange(index, field, e.target.value)
                          }
                        />
                      </td>
                    ))}
                    <td className="p-2 border border-gray-300">
                      <button
                        onClick={() => removeItem(index)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={addItem}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Item
            </button>
          </div>
        );

      case "totals":
        return (
          <div className="mb-6 flex flex-col items-end">
            <div className="w-64">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Subtotal:</span>
                <span>
                  {invoice.currencySymbol}
                  {invoice.subtotal.toFixed(2)}
                </span>
              </div>

              {invoice.deductions.map((deduction, index) => (
                <div key={index} className="flex justify-between mb-2">
                  <span>{deduction.description}</span>
                  <span>
                    {invoice.currencySymbol}
                    {deduction.amount.toFixed(2)}
                  </span>
                </div>
              ))}

              {invoice.additions.map((addition, index) => (
                <div key={index} className="flex justify-between mb-2">
                  <span>{addition.description}</span>
                  <span>
                    {invoice.currencySymbol}
                    {addition.amount.toFixed(2)}
                  </span>
                </div>
              ))}

              <div className="flex justify-between font-bold border-t border-gray-300 pt-2 mt-2">
                <span>Total:</span>
                <span>
                  {invoice.currencySymbol}
                  {invoice.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        );

      case "footer":
        return (
          <div className="mt-8">
            {section.fields.map((field) => (
              <div key={field} className="mb-4">
                {renderField(field, template.labels[field], invoice[field])}
              </div>
            ))}
          </div>
        );

      case "space":
        return <div className="h-6"></div>;

      case "break":
        return <div className="page-break"></div>;

      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Invoice Editor</h1>

      <div className="invoice-container">
        {template.structure.map((section, index) => (
          <div key={index} className={`section-${section.section}`}>
            {renderSection(section)}
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between">
        <button
          onClick={handleSave}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Save Invoice
        </button>

        <PDFDownloadLink
          document={<InvoicePDF invoice={invoice} template={template} />}
          fileName={`invoice-${invoice.invoiceNumber}.pdf`}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {({ blob, url, loading, error }) =>
            loading ? "Generating PDF..." : "Download PDF"
          }
        </PDFDownloadLink>
      </div>
    </div>
  );
};

// PDF generation component for @react-pdf/renderer
const InvoicePDF = ({ invoice, template }) => {
  const styles = StyleSheet.create({
    page: {
      padding: 30,
      fontSize: template.fontSize || 12,
    },
    section: {
      margin: 10,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 20,
    },
    headerLeft: {
      flexDirection: "column",
      alignItems: "flex-start",
    },
    headerRight: {
      flexDirection: "column",
      alignItems: "flex-end",
    },
    logo: {
      width: 120,
      height: 50,
      marginBottom: 10,
    },
    businessName: {
      fontSize: 16,
      fontWeight: "bold",
      textTransform: "uppercase",
    },
    horizontalLine: {
      borderBottomWidth: 1,
      borderBottomColor: "#cccccc",
      marginVertical: 10,
    },
    clientSection: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontWeight: "bold",
      marginBottom: 5,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 5,
    },
    col: {
      flexDirection: "column",
    },
    table: {
      display: "table",
      width: "auto",
      marginVertical: 10,
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "#bfbfbf",
    },
    tableRow: {
      flexDirection: "row",
    },
    tableHeaderCell: {
      backgroundColor: "#f0f0f0",
      padding: 5,
      fontWeight: "bold",
      borderBottomWidth: 1,
      borderBottomColor: "#bfbfbf",
    },
    tableCell: {
      padding: 5,
    },
    totalsTable: {
      width: "40%",
      alignSelf: "flex-end",
      marginTop: 10,
    },
    totalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      borderTopWidth: 1,
      borderTopColor: "#bfbfbf",
      paddingTop: 5,
      marginTop: 5,
      fontWeight: "bold",
    },
    footer: {
      marginTop: 30,
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {template.structure.map((section, index) => {
          switch (section.section) {
            case "header":
              return (
                <View key={index} style={styles.header}>
                  <View style={styles.headerLeft}>
                    {invoice.businessLogo && (
                      <Image src={invoice.businessLogo} style={styles.logo} />
                    )}
                  </View>
                  <View style={styles.headerRight}>
                    <Text style={styles.businessName}>
                      {invoice.businessName}
                    </Text>
                    <Text>{invoice.businessAddress}</Text>
                    <Text>{invoice.businessEmail}</Text>
                    <Text>{invoice.businessPhone}</Text>
                  </View>
                </View>
              );

            case "horizontal-line":
              return <View key={index} style={styles.horizontalLine} />;

            case "clientDetails":
              return (
                <View key={index} style={styles.clientSection}>
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                  <Text>{invoice.clientName}</Text>
                  <Text>{invoice.clientAddress}</Text>
                  <Text>
                    {template.labels.clientEmail} {invoice.clientEmail}
                  </Text>
                  <Text>
                    {template.labels.clientPhone} {invoice.clientPhone}
                  </Text>
                  {invoice.clientTaxId && (
                    <Text>
                      {template.labels.clientTaxId} {invoice.clientTaxId}
                    </Text>
                  )}
                </View>
              );

            case "invoiceDetails":
              return (
                <View key={index} style={styles.row}>
                  <View style={styles.col}>
                    <Text>
                      {template.labels.invoiceNumber} {invoice.invoiceNumber}
                    </Text>
                    <Text>
                      {template.labels.issuedAt} {invoice.issuedAt}
                    </Text>
                  </View>
                  <View style={styles.col}>
                    <Text>
                      {template.labels.dueDate} {invoice.dueDate}
                    </Text>
                    <Text>
                      {template.labels.paymentTerms} {invoice.paymentTerms}
                    </Text>
                  </View>
                </View>
              );

            case "items":
              const columnWidths = {
                description: "40%",
                quantity: "15%",
                rate: "15%",
                total: "15%",
              };

              return (
                <View key={index} style={styles.table}>
                  <View style={styles.tableRow}>
                    {section.items.map((item) => (
                      <Text
                        key={item}
                        style={{
                          ...styles.tableHeaderCell,
                          width: columnWidths[item],
                        }}
                      >
                        {item.charAt(0).toUpperCase() + item.slice(1)}
                      </Text>
                    ))}
                  </View>

                  {invoice.items.map((item, itemIndex) => (
                    <View key={item._id || itemIndex} style={styles.tableRow}>
                      {section.items.map((field) => (
                        <Text
                          key={field}
                          style={{
                            ...styles.tableCell,
                            width: columnWidths[field],
                          }}
                        >
                          {field === "total" || field === "rate"
                            ? `${invoice.currencySymbol}${item[field].toFixed(
                                2
                              )}`
                            : item[field].toString()}
                        </Text>
                      ))}
                    </View>
                  ))}
                </View>
              );

            case "totals":
              return (
                <View key={index} style={styles.totalsTable}>
                  <View style={styles.row}>
                    <Text>Subtotal:</Text>
                    <Text>
                      {invoice.currencySymbol}
                      {invoice.subtotal.toFixed(2)}
                    </Text>
                  </View>

                  {invoice.deductions.map((deduction, i) => (
                    <View key={i} style={styles.row}>
                      <Text>{deduction.description}</Text>
                      <Text>
                        {invoice.currencySymbol}
                        {deduction.amount.toFixed(2)}
                      </Text>
                    </View>
                  ))}

                  {invoice.additions.map((addition, i) => (
                    <View key={i} style={styles.row}>
                      <Text>{addition.description}</Text>
                      <Text>
                        {invoice.currencySymbol}
                        {addition.amount.toFixed(2)}
                      </Text>
                    </View>
                  ))}

                  <View style={styles.totalRow}>
                    <Text>Total:</Text>
                    <Text>
                      {invoice.currencySymbol}
                      {invoice.totalAmount.toFixed(2)}
                    </Text>
                  </View>
                </View>
              );

            case "footer":
              return (
                <View key={index} style={styles.footer}>
                  {invoice.notes && (
                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>
                        {template.labels.notes}
                      </Text>
                      <Text>{invoice.notes}</Text>
                    </View>
                  )}

                  {invoice.paymentInstructions && (
                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>
                        {template.labels.paymentInstructions}
                      </Text>
                      <Text>{invoice.paymentInstructions}</Text>
                    </View>
                  )}
                </View>
              );

            case "space":
              return <View key={index} style={{ height: 20 }} />;

            case "break":
              return <View key={index} break />;

            default:
              return null;
          }
        })}
      </Page>
    </Document>
  );
};

export default InvoiceEditor;
