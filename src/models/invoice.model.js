import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    Template: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Template",
    },
    invoiceNumber: {
      type: String,
      required: true,
    },
    customerId: {
      type: String,
      required: false,
    },
    customer: {
      type: String,
      required: true,
    },
    customerAddress: {
      type: String,
      required: true,
    },
    customerEmail: {
      type: String,
      required: false,
    },
    customerPhone: {
      type: String,
      required: false,
    },
    customerTaxId: {
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
        price: {
          type: Number,
          required: true,
        },
      },
    ],

    subTotal: {
      type: Number,
      required: true,
    },
    deductions: [
      {
        description: { type: String, required: true },
        amount: { type: Number, required: false },
        percent: { type: Number, required: false },
        type: { type: String, enum: ["fixed", "percentage"], required: true },
      },
    ],

    additions: [
      {
        description: { type: String, required: true },
        amount: { type: Number, required: false },
        percent: { type: Number, required: false },
        type: { type: String, enum: ["fixed", "percentage"], required: true }, // New field
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      default: "unpaid",
    },
    paymentStatus: {
      type: Object,
      default: {
        status: "unpaid",
        date: null,
        paymentMethod: null,
        transactionId: null,
      },
    },
  },
  { timestamps: true } // Handles createdAt and updatedAt automatically
);

const Invoice = mongoose.model("Invoice", invoiceSchema);

export default Invoice;
