import Asset from "../SubscriptionsModels/Asset.js";
import fs from "fs";
import path from "path";
import { sendAssetWarrantyExtensionNotification } from "../SubscriptionsServices/email.service.js";


export const getAllAssets = async (req, res, next) => {
  try {
    const data = await Asset.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const getAssetById = async (req, res, next) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) return res.status(404).json({ message: "Not found" });
    res.json(asset);
  } catch (err) {
    next(err);
  }
};

export const createAsset = async (req, res, next) => {
  try {
    const asset = await Asset.create(req.body);
    res.status(201).json(asset);
  } catch (err) {
    next(err);
  }
};

export const updateAsset = async (req, res, next) => {
  try {
    const updated = await Asset.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteAsset = async (req, res, next) => {
  try {
    await Asset.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
};

export const addAssetHistory = async (req, res, next) => {
  try {
    const asset = await Asset.findById(req.params.id);
    asset.history.push(req.body);
    await asset.save();
    res.json(asset.history);
  } catch (err) {
    next(err);
  }
};

export const uploadAssetFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const asset = await Asset.findById(req.params.id);
    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    asset.files.push({
      filename: req.file.filename,
      originalName: req.file.originalname
    });

    await asset.save();

    res.json(asset);
  } catch (err) {
    next(err);
  }
};



export const getAssetHistory = async (req, res, next) => {
  try {
    const asset = await Asset.findById(req.params.id);

    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    res.json(asset.history || []);
  } catch (err) {
    next(err);
  }
};

export const deleteAssetFile = async (req, res, next) => {
  try {
    const { id, filename } = req.params;

    const asset = await Asset.findById(id);
    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    asset.files = asset.files.filter(f => f.filename !== filename);
    await asset.save();

    const filePath = path.join("uploads", filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json(asset);
  } catch (err) {
    next(err);
  }
};


export const extendAssetWarranty = async (req, res, next) => {
  try {
    const { months, cost } = req.body;

    const asset = await Asset.findById(req.params.id);
    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    const currentEnd = asset.warrantyEnd
      ? new Date(asset.warrantyEnd)
      : new Date();

    const nextEnd = new Date(currentEnd);
    nextEnd.setMonth(nextEnd.getMonth() + Number(months));

    asset.warrantyEnd = nextEnd.toISOString().slice(0, 10);

    asset.history.push({
      date: new Date().toISOString().slice(0, 10),
      action: "Warranty Extended",
      extendedForMonths: months,
      cost,
      nextWarrantyEnd: asset.warrantyEnd,
      performedBy: "System"
    });

    await asset.save();
    
    // Send email notification
    try {
      await sendAssetWarrantyExtensionNotification(asset, months);
    } catch (emailError) {
      console.error("Failed to send warranty extension email:", emailError);
      // Don't fail the request if email fails
    }
    
    res.json(asset);
  } catch (err) {
    next(err);
  }
};

