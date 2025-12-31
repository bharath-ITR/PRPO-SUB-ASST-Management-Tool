import EmailModel from "../Models/EmailModelSchema.js";
import { AzureStorageAcc } from "./AzureStorageAcc.js"; // same helper used in Testing1
export const GR_Invoice = async (req, res) => {
  try {
    const {
      PR_no,
      grQuantity,
      grPartially,
      grFully,
      invoiceQuantity,
      invoicePartially,
      invoiceFully,
      userName,
      userEmail,
    } = req.body;

    if (!PR_no) {
      return res.status(400).json({ message: "PR_no is required" });
    }

    const filter = { PR_no };

    // Get OLD DATA for log comparison
    const oldData = await EmailModel.findOne(filter);
    if (!oldData) {
      return res.status(404).json({ message: "PR not found" });
    }

    const update = { $set: {} };
    const changes = {};
    const uploadedFilesLog = []; // will be stored inside activityLog[]

// =========================================
// 1. GR (Goods Receipt) updates
// =========================================

// GR Quantity (Cumulative Add)
if (grQuantity !== undefined) {
  const added = Number(grQuantity);
  const newVal = oldData.grQuantity + added;

  changes.grQuantity = {
    old: oldData.grQuantity,
    added,
    new: newVal,
  };

  update.$set.grQuantity = newVal;
}

// GR STATUS — FIXED LOGIC
if (grFully === "true" || grFully === true) {
  update.$set.grFully = true;
  update.$set.grPartially = false;

  changes.grFully = { old: oldData.grFully, new: true };
  update.$set.status = "gr full";

} else if (grPartially === "true" || grPartially === true) {
  update.$set.grPartially = true;

  changes.grPartially = { old: oldData.grPartially, new: true };
  update.$set.status = "gr partial";
}



    // =========================================
    // 2. Invoice updates
    // =========================================

    // Quantity accumulation
    if (invoiceQuantity !== undefined) {
      const added = Number(invoiceQuantity);
      const newVal = oldData.invoiceQuantity + added;

      changes.invoiceQuantity = {
        old: oldData.invoiceQuantity,
        added,
        new: newVal,
      };

      update.$set.invoiceQuantity = newVal;
    }

    // INVOICE STATUS — FIXED LOGIC
    if (invoiceFully === "true" || invoiceFully === true) {
      update.$set.invoiceFully = true;
      update.$set.invoicePartially = false;

      changes.invoiceFully = { old: oldData.invoiceFully, new: true };
      update.$set.status = "invoice full";
    } else if (invoicePartially === "true" || invoicePartially === true) {
      update.$set.invoicePartially = true;

      changes.invoicePartially = { old: oldData.invoicePartially, new: true };
      update.$set.status = "invoice partial";
    }

    // ==================================================================
    // 3. Upload Receipt Files (multiple) → DB + Activity Log
    // ==================================================================
    if (req.files?.receiptFiles?.length > 0) {
      const uploaded = await Promise.all(
        req.files.receiptFiles.map(async (file) => {
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

          uploadedFilesLog.push({ field: "receiptFiles", ...fileObj });
          return fileObj;
        })
      );

      update.$push = {
        ...(update.$push || {}),
        receiptFiles: { $each: uploaded },
      };

      changes.receiptFiles = {
        old: oldData.receiptFiles.length,
        new: oldData.receiptFiles.length + uploaded.length,
      };
    }

    // ==================================================================
    // 4. Upload Invoice Files (multiple) → DB + Activity Log
    // ==================================================================
    if (req.files?.invoiceFiles?.length > 0) {
      const uploaded = await Promise.all(
        req.files.invoiceFiles.map(async (file) => {
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

          uploadedFilesLog.push({ field: "invoiceFiles", ...fileObj });
          return fileObj;
        })
      );

      update.$push = {
        ...(update.$push || {}),
        invoiceFiles: { $each: uploaded },
      };

      changes.invoiceFiles = {
        old: oldData.invoiceFiles.length,
        new: oldData.invoiceFiles.length + uploaded.length,
      };
    }

    // ==================================================================
    // 5. Store Activity Log
    // ==================================================================
    update.$push = {
      ...(update.$push || {}),
      activityLog: {
        user: userEmail || "User",
        name: userName || " User",
        action: "GR Invoice Update",
        changes,
        uploadedFiles: uploadedFilesLog,
        timestamp: new Date(),
      },
    };

    // ==================================================================
    // 6. Update document
    // ==================================================================
    const result = await EmailModel.updateOne(filter, update);

    res.status(200).json({
      message: "GR and Invoice updated successfully",
      changes,
      uploadedFiles: uploadedFilesLog,
      result,
    });
  } catch (error) {
    console.error("Error in GR_Invoice:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
