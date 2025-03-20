import mongoose from "mongoose";

const templateSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
    required: true,
  },
  structure: {
    type: String,
    required: true,
  },
  isPublilc: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensure mongoose.models is properly initialized
const Template =
  mongoose.models?.Template || mongoose.model("Template", templateSchema);

export default Template;
