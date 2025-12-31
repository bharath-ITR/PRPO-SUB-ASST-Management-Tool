import EmailModel from "../Models/EmailModelSchema.js";
import { AzureStorageAcc } from "./AzureStorageAcc.js";

export const Receipt_Invoice = async (req, res) => {
  try {
    const {
      receiptAmount,
      PR_no,
      receiptUpload,
      paymentprocessType,
      referenceNo,
      userEmail,
      userName,
    } = req.body;

    if (!PR_no) {
      return res.status(400).json({ message: "PR_no is required" });
    }

    const filter = { PR_no };
    const update = {};

    // ------------------ Fetch Existing Document ------------------
    const existingDoc = await EmailModel.findOne(filter);
    if (!existingDoc) {
      return res.status(404).json({ message: "No matching PR found" });
    }

    // ------------------ NEW AMOUNT LOGIC ------------------
    const newReceiptAmount = Number(receiptAmount) || 0;
    const existingAmount = Number(existingDoc.receiptAmount) || 0;

    const totalAmount = existingAmount + newReceiptAmount;

    // ============================================================
    //  UPLOAD FILES TO AZURE
    // ============================================================
    let uploadedAttachments = [];

    if (receiptUpload === "true" || receiptUpload === true) {
      uploadedAttachments = await Promise.all(
        req.files.map(async (file) => {
          const azureResult = await AzureStorageAcc(
            file.buffer,
            file.originalname,
            file.mimetype
          );

          return {
            field: "receiptAttachments",
            filename: azureResult.fileName,
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            path: azureResult.url,
          };
        })
      );

      update.$push = {
        receiptAttachments: {
          $each: uploadedAttachments.map((f) => ({
            filename: f.filename,
            originalname: f.originalname,
            mimetype: f.mimetype,
            size: f.size,
            path: f.path,
          })),
        },
      };
    }

    // ============================================================
    //  SET MAIN FIELDS (Amount + Payment Process + Reference)
    // ============================================================
    update.$set = {
      ...(update.$set || {}),
      paymentprocessType,
      referenceNo,
      receiptUpload: true,
      receiptAmount: totalAmount,
    };

    // ============================================================
    //  ACTIVITY LOG ENTRY
    // ============================================================
    const activityEntry = {
      name: userName || "User",
      mail: userEmail || "User",
      action: "Receipt Updated",
      changes: {
        previousAmount: existingAmount,
        addedAmount: newReceiptAmount,
        totalAmount,
        paymentprocessType,
        referenceNo,
      },
      uploadedFiles: uploadedAttachments,
      timestamp: new Date(),
    };

    update.$push = {
      ...(update.$push || {}),
      activityLog: activityEntry,
    };

    // ============================================================
    // UPDATE IN DB
    // ============================================================
    const result = await EmailModel.updateOne(filter, update);

    res.status(200).json({
      message: "Receipt updated successfully",
      totalAmount,
      result,
    });
  } catch (error) {
    console.error("Error in Receipt_Invoice:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
