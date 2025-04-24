import { useEffect, useState } from "react";
import { useCompanyStore } from "@/store/useCompany";

export default function InvoiceNumberFormat() {
  const [invoiceFormat, setInvoiceFormat] = useState("");
  const { company, setCompanyData } = useCompanyStore();
  const [formatError, setFormatError] = useState("");

  // Initialize invoice format from company data
  useEffect(() => {
    if (company && company.invoicePrefix && company.invoiceSuffix) {
      console.log("If Case");
      setInvoiceFormat(
        `${company.invoicePrefix}/1001/${company.invoiceSuffix}`
      );
    }
    console.log("invoiceFormat: ", invoiceFormat);
  }, [company]);

  const handleChange = (value) => {
    setInvoiceFormat(value);

    // Optional: Validate format (prefix/number/suffix)
    const formatPattern = /^[^/]*\/[^/]*\/[^/]*$/;
    if (value && !formatPattern.test(value)) {
      setFormatError("Format should be prefix/number/suffix");
    } else {
      setFormatError("");
    }

    // Update company data in the store
    const [prefix, number, suffix] = value.split("/");
    setCompanyData((prevData) => ({
      ...prevData,
      invoicePrefix: prefix || "",
      invoiceSuffix: suffix || "",
    }));
  };

  return (
    <input
      type="text"
      className={`input input-bordered w-full ${formatError && "text-red-500"}`}
      placeholder="INV/00001/2025"
      value={invoiceFormat}
      onChange={(e) => handleChange(e.target.value)}
    />
  );
}
