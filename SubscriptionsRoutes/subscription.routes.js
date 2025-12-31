import express from "express";
import {
  getAllSubscriptions,
  getSubscriptionById,
  createSubscription,
  updateSubscription,
  deleteSubscription,
  addSubscriptionHistory,
  uploadSubscriptionFile,
  getSubscriptionHistory,
  renewSubscription,
  pauseSubscription,
  cancelSubscription,
  resumeSubscription,
  updateDescription,
  deleteSubscriptionFile,
  updateSubscriptionFileDescription
} from "../SubscriptionsControllers/subscription.controller.js";

import { upload } from "../SubscriptionsMiddlewares/upload.middleware.js";

const router = express.Router();

router.get("/", getAllSubscriptions);
router.get("/:id", getSubscriptionById);
router.post("/", createSubscription);
router.put("/:id", updateSubscription);
router.delete("/:id", deleteSubscription);

router.post("/:id/renew", renewSubscription);
router.post("/:id/pause", pauseSubscription);
router.post("/:id/resume", resumeSubscription);
router.post("/:id/cancel", cancelSubscription);

// ✅ HISTORY
router.get("/:id/history", getSubscriptionHistory);
router.post("/:id/history", addSubscriptionHistory);

// ✅ FILE UPLOAD
router.put("/:id/description", updateDescription);
router.post("/:id/files", upload.single("file"), uploadSubscriptionFile);
router.delete("/:id/files/:fileId", deleteSubscriptionFile);
router.put("/:id/files/:fileId/description", updateSubscriptionFileDescription);

export default router;

