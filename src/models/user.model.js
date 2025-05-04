import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: false,
  },
  industry: {
    type: String,
    required: false,
  },
  subscriptionPlan: {
    type: String,
    default: "Free",
  },
  invoice: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Invoice",
    required: false,
  },
  invoiceCount: {
    type: Number,
    default: 0,
  },
  invoiceCountMonth: {
    type: String, // Format: '2025-05'
    default: () => new Date().toISOString().slice(0, 7),
  },
  template: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Template",
    },
  ],
  defaultTemplate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Template",
  },
  taxId: {
    type: String,
    required: false,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    // required: true,
  },
});

const User = mongoose.models?.User || mongoose.model("User", userSchema);

export default User;
