import mongoose, { Schema } from "mongoose";

// Define the structure section schema
const SectionSchema = new Schema({
  section: {
    type: String,
    required: true,
    enum: [
      "logo",
      "header",
      "horizontal-line",
      "clientDetails",
      "invoiceDetails",
      "space",
      "items",
      "break",
      "totals",
      "footer",
    ],
  },
  title: String,
  fields: [String],
  style: {
    alignment: {
      type: String,
      enum: ["left", "center", "right"],
    },
    bold: Boolean,
    uppercase: Boolean,
    fontSize: Number,
    Something: Boolean,
  },
  columns: Schema.Types.Mixed, // Can be an array of strings or objects
  items: [String],
});

// Define the template schema
const templateSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    name: {
      type: String,
      required: true,
    },
    fontSize: {
      type: Number,
      default: 14,
    },
    structure: [SectionSchema],
    labels: {
      businessName: String,
      businessAddress: String,
      businessEmail: String,
      businessPhone: String,
      businessLogo: String,
      clientName: String,
      clientEmail: String,
      clientPhone: String,
      clientAddress: String,
      clientTaxId: String,
      invoiceNumber: String,
      issuedAt: String,
      dueDate: String,
      paymentTerms: String,
      subtotal: String,
      tax: String,
      discount: String,
      totalAmount: String,
      notes: String,
      paymentInstructions: String,
    },
  },
  { timestamps: true }
);

// Ensure mongoose.models is properly initialized
const Template =
  mongoose.models?.Template || mongoose.model("Template", templateSchema);

export default Template;
