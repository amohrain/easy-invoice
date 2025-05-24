import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  businessName: {
    type: String,
    required: true,
  },
  businessAddress: {
    type: String,
    required: false,
  },
  businessLogo: {
    type: String,
    required: false,
  },
  businessEmail: {
    type: String,
    required: false,
  },
  businessPhone: {
    type: String,
    required: false,
  },
  businessWebsite: {
    type: String,
    required: false,
  },
  notes: {
    type: String,
    required: false,
  },
  businessTaxId: {
    type: String,
    required: false,
  },
  currency: {
    type: String,
    required: false,
  },
  // invoicePrefix: {
  //   type: String,
  //   required: false,
  //   default: "INV",
  // },
  // invoiceSuffix: {
  //   type: String,
  //   required: false,
  //   default: new Date().getFullYear(),
  // },
  paymentInstructions: {
    type: String,
    required: false,
  },
  notes: {
    type: String,
    required: true,
    default: "Thank you for the business!",
  },
  qrText: {
    type: String,
    required: false,
  },
  QR: {
    type: String,
    required: false,
  },
  upiId: {
    type: String,
    required: false,
  },
  autoAddUPI: {
    type: Boolean,
    required: false,
    default: false,
  },
  paymentTerms: {
    type: String,
    required: false,
  },
  apiKey: {
    type: String,
    required: false,
  },
});

const Company =
  mongoose.models.Company || mongoose.model("Company", companySchema);

export default Company;
