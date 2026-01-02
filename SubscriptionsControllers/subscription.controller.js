import Subscription from "../SubscriptionsModels/Subscription.js";
import fs from "fs";
import path from "path";
import { 
  sendSubscriptionActionNotification,
  sendSubscriptionRenewalReminder,
  sendEmail
} from "../SubscriptionsServices/email.service.js";


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
    
    // Send email notification
    try {
      await sendSubscriptionActionNotification(sub, "renewed");
    } catch (emailError) {
      console.error("Failed to send renewal email:", emailError);
      // Don't fail the request if email fails
    }
    
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
    
    // Send email notification
    try {
      await sendSubscriptionActionNotification(sub, "paused");
    } catch (emailError) {
      console.error("Failed to send pause email:", emailError);
      // Don't fail the request if email fails
    }
    
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
    
    // Send email notification
    try {
      await sendSubscriptionActionNotification(sub, "cancelled");
    } catch (emailError) {
      console.error("Failed to send cancellation email:", emailError);
      // Don't fail the request if email fails
    }
    
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
    
    // Send email notification
    try {
      await sendSubscriptionActionNotification(sub, "resumed");
    } catch (emailError) {
      console.error("Failed to send resume email:", emailError);
      // Don't fail the request if email fails
    }
    
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

// ---------------- TEST EMAIL ---------------- 
export const testEmail = async (req, res, next) => {
  try {
    const { email, type } = req.body;

    if (!email) {
      return res.status(400).json({ 
        message: "Email address is required",
        example: { email: "test@example.com", type: "simple|renewal|action" }
      });
    }

    let result;

    if (type === "renewal") {
      // Test renewal reminder email
      const testSubscription = {
        name: "Test Subscription",
        vendor: "Test Vendor",
        billingCycle: "Monthly",
        cost: 1000,
        costCurrency: "₹",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
        status: "ACTIVE",
        owner: {
          email: email,
          name: "Test User"
        }
      };
      result = await sendSubscriptionRenewalReminder(testSubscription, 7, [email]);
    } else if (type === "action") {
      // Test action notification email
      const testSubscription = {
        name: "Test Subscription",
        vendor: "Test Vendor",
        billingCycle: "Monthly",
        cost: 1000,
        costCurrency: "₹",
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: "ACTIVE",
        owner: {
          email: email,
          name: "Test User"
        }
      };
      result = await sendSubscriptionActionNotification(testSubscription, "renewed", [email]);
    } else {
      // Simple test email - Outlook-compatible
      const htmlBody = `
        <!DOCTYPE html>
        <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <!--[if mso]>
          <noscript>
            <xml>
              <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
              </o:OfficeDocumentSettings>
            </xml>
          </noscript>
          <![endif]-->
          <style type="text/css">
            body { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; }
            table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          </style>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f4;">
            <tr>
              <td align="center" style="padding: 20px 0;">
                <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                  <!-- Header -->
                  <tr>
                    <td style="background-color: #667eea; padding: 30px 20px; text-align: center;">
                      <h2 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">✅ Test Email Successful!</h2>
                    </td>
                  </tr>
                  <!-- Content -->
                  <tr>
                    <td style="padding: 30px 20px; background-color: #ffffff;">
                      <p style="margin: 0 0 15px 0; font-size: 16px; color: #333333; line-height: 1.6;">Dear User,</p>
                      <p style="margin: 0 0 20px 0; font-size: 16px; color: #333333; line-height: 1.6;">This is a test email from the Subscriptions & Assets Management System.</p>
                      
                      <!-- Success Box -->
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #d4edda; border-left: 4px solid #28a745; margin: 20px 0;">
                        <tr>
                          <td style="padding: 20px;">
                            <p style="margin: 0; font-size: 16px; color: #155724; line-height: 1.6;">
                              <strong>✅ Email Configuration Working:</strong> If you received this email, your AWS SES configuration is correct and emails are being sent successfully.
                            </p>
                          </td>
                        </tr>
                      </table>

                      <p style="margin: 20px 0 10px 0; font-size: 16px; color: #333333; line-height: 1.6;"><strong>Test Details:</strong></p>
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 10px 0;">
                        <tr>
                          <td style="padding: 5px 0; font-size: 14px; color: #333333;">• Recipient: ${email}</td>
                        </tr>
                        <tr>
                          <td style="padding: 5px 0; font-size: 14px; color: #333333;">• Sent at: ${new Date().toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td style="padding: 5px 0; font-size: 14px; color: #333333;">• Type: Simple Test Email</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 20px; background-color: #f9f9f9; text-align: center;">
                      <p style="margin: 0 0 5px 0; font-size: 12px; color: #777777;">This is an automated test notification.</p>
                      <p style="margin: 0; font-size: 12px; color: #777777;">Please do not reply to this email.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `;

      const textBody = `
Test Email Successful!

This is a test email from the Subscriptions & Assets Management System.

If you received this email, your AWS SES configuration is correct.

Test Details:
- Recipient: ${email}
- Sent at: ${new Date().toLocaleString()}
- Type: Simple Test Email
      `;

      result = await sendEmail(email, "Test Email - Subscriptions & Assets Management System", htmlBody, textBody);
    }

    res.json({
      success: true,
      message: "Test email sent successfully",
      result,
      recipient: email,
      type: type || "simple"
    });
  } catch (error) {
    console.error("Test email error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send test email",
      error: error.message,
      details: "Check your AWS SES configuration and ensure the email address is verified in AWS SES"
    });
  }
};

