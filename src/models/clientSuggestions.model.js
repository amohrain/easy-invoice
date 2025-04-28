import mongoose from "mongoose";

const suggestionSchema = new mongoose.Schema({
  invoice: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "invoice",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
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
  status: {
    type: String,
    required: true,
    default: "Pending",
    enum: ["Pending", "Allowed", "Rejected"],
  },
});

const Suggestion =
  mongoose.models?.Suggestion || mongoose.model("Suggestion", suggestionSchema);

export default Suggestion;
