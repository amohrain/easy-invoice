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
