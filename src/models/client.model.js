import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
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
      required: true,
    },
    clientPhone: {
      type: String,
      required: true,
    },
    clientTaxId: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      default: "active",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
  },
  { timestamps: true }
);

const Client =
  mongoose.models?.Client || mongoose.model("Client", clientSchema);

export default Client;
