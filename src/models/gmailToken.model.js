import mongoose from "mongoose";

const GmailTokenSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    access_token: String,
    refresh_token: String,
    scope: String,
    token_type: String,
    expiry_date: Number,
  },
  { timestamps: true }
);

const GmailToken =
  mongoose.models.GmailToken || mongoose.model("GmailToken", GmailTokenSchema);

export default GmailToken;
