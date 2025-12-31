import Subscription from "../SubscriptionsModels/Subscription.js";
import fs from "fs";
import path from "path";


// helper
const getMonthsByCycle = (cycle) => {
  if (cycle === "Monthly") return 1;
  if (cycle === "Quarterly") return 3;
  if (cycle === "Yearly") return 12;
  return 1;
};

// Auto-advance next renewal when due date has passed
const autoRenewIfDue = (sub) => {
  if (!sub?.dueDate || sub.status !== "ACTIVE") return false;

  const months = getMonthsByCycle(sub.billingCycle);
  if (!months) return false;

  const today = new Date();
  let currentDue = new Date(sub.dueDate);

  // Move forward until the next due date is in the future
  let changed = false;
  while (currentDue <= today) {
    const nextDue = new Date(currentDue);
    nextDue.setMonth(nextDue.getMonth() + months);

    sub.history.push({
      action: "Auto-Renewed",
      date: today,
      previousDueDate: currentDue,
      nextDueDate: nextDue,
      previousCost: sub.cost,
      newCost: sub.cost,
      costCurrency: sub.costCurrency
    });

    currentDue = nextDue;
    changed = true;
  }

  if (changed) {
    sub.dueDate = currentDue;
    sub.notificationsEnabled = true;
  }

  return changed;
};




// ---------------- RENEW ----------------
export const renewSubscription = async (req, res, next) => {
  try {
    const { newCost, costCurrency } = req.body;

    const sub = await Subscription.findById(req.params.id);
    if (!sub) return res.status(404).json({ message: "Not found" });

    const today = new Date();
    const currentDue = new Date(sub.dueDate);

    const startDate = currentDue < today ? today : currentDue;

    const months =
      sub.billingCycle === "Monthly" ? 1 :
      sub.billingCycle === "Quarterly" ? 3 : 12;

    const nextDue = new Date(startDate);
    nextDue.setMonth(nextDue.getMonth() + months);

    const previousCost = sub.cost;

    const nextCurrency = costCurrency ?? sub.costCurrency ?? "₹";

    sub.history.push({
      action: "Renewed",
      date: today,
      previousDueDate: sub.dueDate,
      nextDueDate: nextDue,
      previousCost,
      newCost: newCost ?? previousCost,
      costCurrency: nextCurrency
    });

    sub.cost = newCost ?? previousCost;
    sub.costCurrency = nextCurrency;
    sub.dueDate = nextDue;
    sub.status = "ACTIVE";
    sub.notificationsEnabled = true;

    await sub.save();
    res.json(sub);
  } catch (err) {
    next(err);
  }
};


// ---------------- PAUSE ----------------
export const pauseSubscription = async (req, res, next) => {
  try {
    const sub = await Subscription.findById(req.params.id);
    if (!sub) return res.status(404).json({ message: "Not found" });

    sub.status = "PAUSED";
    sub.notificationsEnabled = false;

    await sub.save();
    res.json(sub);
  } catch (err) {
    next(err);
  }
};

// ---------------- CANCEL ----------------
export const cancelSubscription = async (req, res, next) => {
  try {
    const sub = await Subscription.findById(req.params.id);
    if (!sub) return res.status(404).json({ message: "Not found" });

    sub.status = "CANCELLED";
    sub.notificationsEnabled = false;

    await sub.save();
    res.json(sub);
  } catch (err) {
    next(err);
  }
};


//------------------ RESUME ----------------
export const resumeSubscription = async (req, res, next) => {
  try {
    const sub = await Subscription.findById(req.params.id);
    if (!sub) return res.status(404).json({ message: "Not found" });

    if (sub.status !== "PAUSED") {
      return res.status(400).json({ message: "Subscription is not paused" });
    }

    sub.status = "ACTIVE";
    sub.notificationsEnabled = true;

    sub.history.push({
      action: "Resumed",
      date: new Date()
    });

    await sub.save();
    res.json(sub);
  } catch (err) {
    next(err);
  }
};


export const getAllSubscriptions = async (req, res, next) => {
  try {
    const data = await Subscription.find().sort({ createdAt: -1 });

    // Auto-roll forward any due dates that have passed
    const updated = await Promise.all(
      data.map(async (sub) => {
        const changed = autoRenewIfDue(sub);
        if (changed) await sub.save();
        return sub;
      })
    );

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const getSubscriptionById = async (req, res, next) => {
  try {
    const sub = await Subscription.findById(req.params.id);

    if (!sub) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    const changed = autoRenewIfDue(sub);
    if (changed) await sub.save();

    res.json(sub);
  } catch (err) {
    next(err);
  }
};


export const createSubscription = async (req, res, next) => {
  try {
    const sub = await Subscription.create(req.body);
    res.status(201).json(sub);
  } catch (err) {
    next(err);
  }
};

export const updateSubscription = async (req, res, next) => {
  try {
    const updated = await Subscription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    next(err);
  }
};





export const addSubscriptionHistory = async (req, res, next) => {
  try {
    const sub = await Subscription.findById(req.params.id);
    sub.history.push(req.body);
    await sub.save();
    res.json(sub.history);
  } catch (err) {
    next(err);
  }
};

export const uploadSubscriptionFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const sub = await Subscription.findById(req.params.id);
    if (!sub) return res.status(404).json({ message: "Not found" });

    sub.files.push({
      filename: req.file.filename,
      originalName: req.file.originalname,
      url: `/uploads/${req.file.filename}`,
      type: req.file.mimetype,
      description: req.body.description || ""
    });

    await sub.save();
    res.json(sub); // ✅ always return updated subscription
  } catch (err) {
    next(err);
  }
};


export const uploadFile = async (req, res, next) => {
  try {
    const sub = await Subscription.findById(req.params.id);
    if (!sub) return res.status(404).json({ message: "Not found" });

    sub.files.push({
      filename: req.file.filename,
      originalName: req.file.originalname,
      url: `/uploads/${req.file.filename}`
    });

    await sub.save();
    res.json(sub);
  } catch (err) {
    next(err);
  }
};

export const updateSubscriptionFileDescription = async (req, res, next) => {
  try {
    const { id, fileId } = req.params;
    const { description } = req.body;

    const sub = await Subscription.findById(id);
    if (!sub) return res.status(404).json({ message: "Subscription not found" });

    const file = sub.files.id(fileId);
    if (!file) return res.status(404).json({ message: "File not found" });

    file.description = description || "";
    await sub.save();

    res.json(sub);
  } catch (err) {
    next(err);
  }
};




export const getSubscriptionHistory = async (req, res, next) => {
  try {
    const sub = await Subscription.findById(req.params.id);

    if (!sub) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    res.json(sub.history || []);
  } catch (err) {
    next(err);
  }
};




export const updateDescription = async (req, res, next) => {
  try {
    const sub = await Subscription.findById(req.params.id);
    if (!sub) return res.status(404).json({ message: "Not found" });

    sub.description = req.body.description;
    await sub.save();

    res.json(sub);
  } catch (err) {
    next(err);
  }
};




export const deleteSubscription = async (req, res, next) => {
  try {
    const sub = await Subscription.findByIdAndDelete(req.params.id);

    if (!sub) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    res.json({ message: "Subscription deleted successfully" });
  } catch (err) {
    next(err);
  }
};




export const deleteSubscriptionFile = async (req, res, next) => {
  try {
    const { id, fileId } = req.params;

    const sub = await Subscription.findById(id);
    if (!sub) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    const file = sub.files.id(fileId);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // ✅ delete from disk (file.url starts with /uploads/...)
    const relativePath = file.url.startsWith("/") ? file.url.slice(1) : file.url;
    const filePath = path.join(process.cwd(), relativePath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // ✅ delete from DB
    file.deleteOne();
    await sub.save();

    // ✅ IMPORTANT: return updated subscription
    res.json(sub);
  } catch (err) {
    next(err);
  }
};

