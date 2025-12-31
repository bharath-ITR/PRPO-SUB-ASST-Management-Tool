import mongoose from "mongoose";
// FileModelSchema.js
const emailModelSchema = new mongoose.Schema(
  {
    sender: String,
    senderName: String,
    To: [String],
    subject: String,
    PR_no: String,
    isPOcreated: { type: Boolean, default: false },
    productReceived: { type: Boolean, default: false },
    invoiceUpload: { type: Boolean, default: false },
    poDone: { type: Boolean, default: false },
    poInvoice: { type: Boolean, default: false },

    grQuantity: { type: Number, default: 0 },
    grPartially: { type: Boolean, default: false },
    grFully: { type: Boolean, default: false },

    invoiceQuantity: { type: Number, default: 0 },
    invoicePartially: { type: Boolean, default: false },
    invoiceFully: { type: Boolean, default: false },

    POupdateComment: { type: String },
    poQuantity: { type: Number, default: 0 },
    receiptFiles: [
      {
        filename: String,
        originalname: String,
        path: String,
        size: Number,
        mimetype: String,
        content: Buffer,
        encoding: String,
      },
    ],
    invoiceFiles: [
      {
        filename: String,
        originalname: String,
        path: String,
        size: Number,
        mimetype: String,
        content: Buffer,
        encoding: String,
      },
    ],
    poInvoiceAttachments: [
      {
        filename: String,
        originalname: String,
        path: String,
        size: Number,
        mimetype: String,
        content: Buffer,
        encoding: String,
      },
    ],
    invoiceAttachments: [
      {
        filename: String,
        originalname: String,
        path: String,
        size: Number,
        mimetype: String,
        content: Buffer,
        encoding: String,
      },
    ],
    receiptUpload: { type: Boolean, default: false },
    paymentprocessType: { type: String },
    referenceNo: { type: String },
    receiptAmount: { type: Number, default: 0 },
    receiptAttachments: [
      {
        filename: String,
        originalname: String,
        path: String,
        size: Number,
        mimetype: String,
        content: Buffer,
        encoding: String,
      },
    ],
    body: {
      usermail: String,
      sender_name: String,
      currentDate: String,
      expectedDate: String,
      purchaseType: String,
      location: String,
      productName: String,
      productReason: String,
      quantity: String,
      productDescription: String,
      unitPrice: String,
      approxCost: String,
      totalAmount: String,
      currency: String,
      paymentType: String,
      comment: String,

      attachment: [
        {
          filename: String,
          originalname: String,
          path: String,
          size: Number,
          mimetype: String,
          content: Buffer,
          encoding: String,
        },
      ],
    },
    status: {
      type: String,
      enum: [
        "pending for approval",
        "in process",
        "processing",
        "approved",
        "rejected",
        "Ready For Purchase",
        "completed",
        "gr partial",
        "gr full",
        "invoice partial",
        "invoice full",
      ],
      default: "pending for approval",
    },
    dateSent: Date,
    isBlocked: { type: Boolean, default: false },
    reportingToAndSupervisor: [
      {
        sendTo: String,
        sendToName: String,
        tokens: {
          approve: String,
          reject: String,
        },
        Comment: String,
        response: String,
        // ✅ Correct way — store manual date and time
        updatedAt: { type: Date, default: null },
      },
      {
        sendTo: String,
        sendToName: String,
        tokens: {
          approve: String,
          reject: String,
        },
        Comment: String,
        response: String,
        updatedAt: { type: Date, default: null },
      },
      {
        sendTo: String,
        sendToName: String,
        finalApprover: String,
        tokens: {
          approve: String,
          reject: String,
        },
        Comment: String,
        response: String,
        updatedAt: { type: Date, default: null },
      },
    ],

    activityLog: [
      {
        name: String,
        mail: String,
        action: String,
        changes: Object,
        uploadedFiles: [
          {
            field: String, // "receiptFiles" or "invoiceFiles"
            filename: String,
            originalname: String,
            mimetype: String,
            size: Number,
            path: String,
          },
        ],
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true } // ⏱ adds createdAt and updatedAt automatically
);

const EmailModel = mongoose.model("Purchase Requisition", emailModelSchema);

export default EmailModel;
