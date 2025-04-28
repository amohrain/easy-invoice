import mongoose, { Schema } from "mongoose";

// Define the template schema
const templateSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  style: {
    defaultStyle: {
      size: { type: Number, default: 14 },
      fontColor: { type: String, default: "content" },
    },
    colors: {
      content: { type: String, default: "#111111" },
      primary: { type: String, default: "#ebebeb" },
      accent: { type: String, default: "#999999" },
    },
    borders: {
      margins: { type: Number, default: 5 },
      lineWidth: { type: Number, default: 1 },
      radius: { type: Number, default: 0 },
      color: { type: String, default: "primary" },
    },
  },
  structure: [
    {
      section: { type: String, required: true },
      title: { type: String },
      style: {
        bold: { type: Boolean },
        size: { type: Number },
        alignment: { type: String, enum: ["left", "center", "right"] },
        uppercase: { type: Boolean },
        fontSize: { type: Number },
        color: { type: String },
        borderColor: { type: String },
        borderWidth: { type: Number },
      },
      items: [
        {
          key: { type: String },
          placeholder: { type: String },
          bold: { type: Boolean },
          alignment: { type: String },
          size: { type: Number },
          border: { type: Boolean },
        },
      ],
      columns: [
        {
          fields: [
            {
              key: { type: String },
              placeholder: { type: String },
              value: { type: Boolean },
              bold: { type: Boolean },
              size: { type: Number },
            },
          ],
          style: {
            alignment: { type: String, enum: ["left", "center", "right"] },
          },
        },
      ],
      fields: [
        {
          key: { type: String },
          placeholder: { type: String },
          value: { type: Boolean },
          bold: { type: Boolean },
          size: { type: Number },
        },
      ],
      tableStyle: {
        borderStyle: { type: String },
        borderColor: { type: String },
        border: { type: Boolean },
        outsideBorders: { type: Boolean },
        insideVerticalBorders: { type: Boolean },
        insideHorizontalBorders: { type: Boolean },
        headerHorizontalBorder: { type: Boolean },
      },
    },
  ],
});

// // Define the structure section schema
// const SectionSchema = new Schema({
//   section: {
//     type: String,
//     required: true,
//     enum: [
//       "logo",
//       "header",
//       "horizontal-line",
//       "clientDetails",
//       "invoiceDetails",
//       "space",
//       "items",
//       "break",
//       "totals",
//       "footer",
//     ],
//   },
//   title: String,
//   fields: [String],
//   style: {
//     alignment: {
//       type: String,
//       enum: ["left", "center", "right"],
//     },
//     bold: Boolean,
//     uppercase: Boolean,
//     fontSize: Number,
//     Something: Boolean,
//   },
//   columns: Schema.Types.Mixed, // Can be an array of strings or objects
//   items: [String],
// });

// // Define the template schema
// const templateSchema = new Schema(
//   {
//     isPublic: {
//       type: Boolean,
//       default: false,
//     },
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: false,
//     },
//     name: {
//       type: String,
//       required: true,
//     },
//     fontSize: {
//       type: Number,
//       default: 14,
//     },
//     structure: [SectionSchema],
//     labels: {
//       businessName: String,
//       businessAddress: String,
//       businessEmail: String,
//       businessPhone: String,
//       businessLogo: String,
//       clientName: String,
//       clientEmail: String,
//       clientPhone: String,
//       clientAddress: String,
//       clientTaxId: String,
//       invoiceNumber: String,
//       issuedAt: String,
//       dueDate: String,
//       paymentTerms: String,
//       subtotal: String,
//       tax: String,
//       discount: String,
//       totalAmount: String,
//       notes: String,
//       paymentInstructions: String,
//     },
//   },
//   { timestamps: true }
// );

// Ensure mongoose.models is properly initialized
const Template =
  mongoose.models?.Template || mongoose.model("Template", templateSchema);

export default Template;
