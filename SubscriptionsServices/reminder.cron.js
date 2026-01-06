import cron from "node-cron";
import Subscription from "../SubscriptionsModels/Subscription.js";
import Asset from "../SubscriptionsModels/Asset.js";
import {
  sendSubscriptionRenewalReminder,
  sendAssetWarrantyExpirationReminder,
} from "./email.service.js";

// Reminder days: 15 days, 7 days, 3 days, and on the day (0 days)
const REMINDER_DAYS = [15, 7, 3, 0];

/**
 * Calculate days between two dates
 */
const getDaysUntil = (targetDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const target = new Date(targetDate);
  target.setHours(0, 0, 0, 0);
  
  const diffTime = target - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

/**
 * Send renewal reminders for subscriptions
 */
const checkSubscriptionRenewals = async () => {
  try {
    console.log("🔔 Checking subscription renewals...");
    
    const subscriptions = await Subscription.find({
      dueDate: { $ne: null },
      status: "ACTIVE",
      notificationsEnabled: { $ne: false },
      $or: [
        { "owners.0.email": { $exists: true, $ne: null } },
        { "owner.email": { $exists: true, $ne: null } }
      ]
    });

    let remindersSent = 0;
    let skippedNoOwner = 0;

    for (const sub of subscriptions) {
      if (!sub.dueDate) continue;
      
      // Skip if no owners assigned
      const hasOwner =
        (sub.owners && sub.owners.length > 0) ||
        (sub.owner && sub.owner.email);
      if (!hasOwner) {
        skippedNoOwner++;
        continue;
      }

      const daysLeft = getDaysUntil(sub.dueDate);

      if (REMINDER_DAYS.includes(daysLeft)) {
        try {
          const result = await sendSubscriptionRenewalReminder(sub, daysLeft);
          if (result.success) {
            remindersSent++;
            console.log(
              `✅ Sent renewal reminder for "${sub.name}" - ${daysLeft} day(s) remaining`
            );
          } else {
            console.log(
              `⚠️ Skipped reminder for "${sub.name}" - ${result.message}`
            );
          }
        } catch (error) {
          console.error(
            `❌ Failed to send reminder for subscription "${sub.name}":`,
            error.message
          );
        }
      }
    }
    
    if (skippedNoOwner > 0) {
      console.log(
        `⚠️ Skipped ${skippedNoOwner} subscription(s) without owner`
      );
    }

    console.log(
      `📧 Subscription reminders: ${remindersSent} email(s) sent`
    );
  } catch (error) {
    console.error("❌ Error checking subscription renewals:", error);
  }
};

/**
 * Send warranty expiration reminders for assets
 */
const checkAssetWarranties = async () => {
  try {
    console.log("🔔 Checking asset warranties...");
    
    const assets = await Asset.find({
      warrantyEnd: { $ne: null },
    });

    let remindersSent = 0;

    for (const asset of assets) {
      if (!asset.warrantyEnd) continue;

      const daysLeft = getDaysUntil(asset.warrantyEnd);

      if (REMINDER_DAYS.includes(daysLeft)) {
        try {
          await sendAssetWarrantyExpirationReminder(asset, daysLeft);
          remindersSent++;
          console.log(
            `✅ Sent warranty reminder for "${asset.name}" - ${daysLeft} day(s) remaining`
          );
        } catch (error) {
          console.error(
            `❌ Failed to send reminder for asset "${asset.name}":`,
            error.message
          );
        }
      }
    }

    console.log(
      `📧 Asset warranty reminders: ${remindersSent} email(s) sent`
    );
  } catch (error) {
    console.error("❌ Error checking asset warranties:", error);
  }
};

/**
 * Main cron job function
 * Runs daily at 9:00 AM
 */
const runReminderCron = async () => {
  console.log("🚀 Starting reminder cron job...");
  await checkSubscriptionRenewals();
  await checkAssetWarranties();
  console.log("✅ Reminder cron job completed");
};

/**
 * Start the cron job
 * Schedule: Daily at 9:00 AM
 */
export const startReminderCron = () => {
  // Run daily at 9:00 AM
  cron.schedule("0 9 * * *", async () => {
    await runReminderCron();
  });

  console.log("⏰ Reminder cron job scheduled: Daily at 9:00 AM");
  
  // Optionally run immediately on startup (for testing)
  // Uncomment the line below if you want to test immediately
  // runReminderCron();
};

export default startReminderCron;

