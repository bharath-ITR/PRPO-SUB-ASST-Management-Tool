import EmailModel from "../Models/EmailModelSchema.js";
import { AzureStorageAcc } from "./AzureStorageAcc.js";

export const PO_CreationDone = async (req, res) => {
  try {
    const { 
      PR_no, 
      poDone, 
      poInvoice,
      poQuantity,
      POupdateComment,
      userName,
      userEmail 
    } = req.body;

    if (!PR_no) {
      return res.status(400).json({ message: "PR_no is required" });
    }

    const filter = { PR_no };

    // Fetch old data for activity log
    const oldData = await EmailModel.findOne(filter);
    if (!oldData) {
      return res.status(404).json({ message: "PR not found" });
    }

    const update = { $set: {}, $push: {} };
    const changes = {};
    const uploadedFilesLog = [];

    // -----------------------------------
    // 1. PO Creation Done
    // -----------------------------------
    if (poDone === "true" || poDone === true) {
      changes.poDone = { old: oldData.poDone, new: true };
      update.$set.poDone = true;
    }

    // -----------------------------------
    // 2. PO Quantity (Add to existing)
    // -----------------------------------
if (poQuantity !== undefined) {
  const newVal = Number(poQuantity);

  changes.poQuantity = {
    old: oldData.poQuantity,
    new: newVal
  };

  update.$set.poQuantity = newVal;
}


    // -----------------------------------
    // 3. PO Update Comment
    // -----------------------------------
    if (POupdateComment !== undefined) {
      changes.POupdateComment = {
        old: oldData.POupdateComment,
        new: POupdateComment,
      };

      update.$set.POupdateComment = POupdateComment;
    }

    // -----------------------------------
    // 4. Upload PO Invoice Files
    // -----------------------------------
    if ((poInvoice === "true" || poInvoice === true) && req.files?.length > 0) {
      const uploadedFiles = await Promise.all(
        req.files.map(async (file) => {
          const az = await AzureStorageAcc(
            file.buffer,
            file.originalname,
            file.mimetype
          );

          const fileObj = {
            filename: az.fileName,
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            path: az.url,
          };

          uploadedFilesLog.push({ field: "poInvoiceAttachments", ...fileObj });
          return fileObj;
        })
      );

      update.$push.poInvoiceAttachments = { $each: uploadedFiles };

      changes.poInvoiceAttachments = {
        old: oldData.poInvoiceAttachments.length,
        new: oldData.poInvoiceAttachments.length + uploadedFiles.length,
      };

      update.$set.poInvoice = true;
    }

    // -----------------------------------
    // 5. Activity Log Entry
    // -----------------------------------
    update.$push.activityLog = {
      user: userEmail || "Unknown",
      name: userName || "User",
      action: "PO Creation / Invoice Update",
      changes,
      uploadedFiles: uploadedFilesLog,
      timestamp: new Date(),
    };

    // -----------------------------------
    // 6. Update the Document
    // -----------------------------------
    const result = await EmailModel.updateOne(filter, update);

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "No matching PR found" });
    }

    res.status(200).json({
      message: "PO Update successful",
      changes,
      uploadedFiles: uploadedFilesLog,
      result,
    });

  } catch (error) {
    console.error("Error in PO_CreationDone:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
