import express from "express";
import {
  getAllAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset,
  addAssetHistory,
  uploadAssetFile,
  getAssetHistory,
  deleteAssetFile,
  extendAssetWarranty,
  
} from "../SubscriptionsControllers/asset.controller.js";

import { upload } from "../SubscriptionsMiddlewares/upload.middleware.js";

const router = express.Router();

router.get("/", getAllAssets);
router.get("/:id", getAssetById);
router.post("/", createAsset);
router.put("/:id", updateAsset);
router.delete("/:id", deleteAsset);
router.post("/:id/extend-warranty", extendAssetWarranty);


// ✅ HISTORY
router.get("/:id/history", getAssetHistory);
router.post("/:id/history", addAssetHistory);

// ✅ FILE UPLOAD
router.post("/:id/upload", upload.single("file"), uploadAssetFile);
router.delete("/:id/files/:filename", deleteAssetFile);


export default router;

