import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    template: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Template",
    },
    invoiceId: {
      type: Number,
      required: false,
    },
    invoiceNumber: {
      type: String,
      required: false,
    },
    businessName: {
      type: String,
      required: true,
    },
    businessAddress: {
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
    businessTaxId: {
      type: String,
      required: false,
    },
    businessLogo: {
      type: String,
      required: false,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: false,
    },
    clientName: {
      type: String,
      required: true,
    },
    clientAddress: {
      type: String,
      required: true,
    },
    clientEmail: {
      type: String,
      required: false,
    },
    clientPhone: {
      type: String,
      required: false,
    },
    clientTaxId: {
      type: String,
      required: false,
    },
    issuedAt: {
      type: String,
      required: false,
    },
    dueDate: {
      type: String,
      required: false,
    },
    paymentTerms: {
      type: String,
      required: false,
    },
    currencySymbol: {
      type: String,
      required: false,
    },

    items: [
      {
        description: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        rate: {
          type: Number,
          required: true,
        },
        discount: {
          type: Number,
          required: false,
        },
        total: {
          type: Number,
          required: true,
        },
      },
    ],
    subtotal: {
      type: Number,
      required: true,
    },
    deductions: [
      {
        description: { type: String, required: true },
        amount: { type: Number, required: false },
        percent: { type: Number, required: false },
      },
    ],

    additions: [
      {
        description: { type: String, required: true },
        amount: { type: Number, required: false },
        percent: { type: Number, required: false },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },
    notes: {
      type: String,
      required: false,
    },
    paymentInstructions: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true } // Handles createdAt and updatedAt automatically
);

const Invoice =
  mongoose.models?.Invoice || mongoose.model("Invoice", invoiceSchema);

export default Invoice;
