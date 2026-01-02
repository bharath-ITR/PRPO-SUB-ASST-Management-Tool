# Email Configuration Guide

This document explains how to configure email functionality for the Subscriptions & Assets Management System.

## Prerequisites

1. **AWS SES Account**: You need an AWS account with SES (Simple Email Service) configured
2. **Verified Email Domain**: Your sending email address must be verified in AWS SES
3. **AWS Credentials**: Access Key ID and Secret Access Key with SES permissions

## Environment Variables

Add the following environment variables to your `.env` file:

```env
# AWS SES Configuration
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=us-east-2

# Email Configuration
FROM_EMAIL=Marketing@itradiant1.com
ADMIN_EMAILS=admin1@example.com,admin2@example.com,admin3@example.com
```

### Environment Variable Details

- **AWS_ACCESS_KEY_ID**: Your AWS access key ID
- **AWS_SECRET_ACCESS_KEY**: Your AWS secret access key
- **AWS_REGION**: AWS region where your SES is configured (default: `us-east-2`)
- **FROM_EMAIL**: The email address that will appear as the sender (must be verified in AWS SES)
- **ADMIN_EMAILS**: Comma-separated list of email addresses to receive notifications (defaults to FROM_EMAIL if not set)

## Email Notifications

The system sends the following types of emails:

### 1. Subscription Renewal Reminders
- **When**: 7 days, 3 days, and on the day (0 days) before renewal date
- **Recipients**: Admin emails (configured in `ADMIN_EMAILS`)
- **Schedule**: Daily at 9:00 AM

### 2. Asset Warranty Expiration Reminders
- **When**: 7 days, 3 days, and on the day (0 days) before warranty end date
- **Recipients**: Admin emails (configured in `ADMIN_EMAILS`)
- **Schedule**: Daily at 9:00 AM

### 3. Subscription Action Notifications
- **When**: Subscription is renewed, paused, resumed, or cancelled
- **Recipients**: Admin emails (configured in `ADMIN_EMAILS`)
- **Trigger**: Immediate (when action is performed)

### 4. Asset Warranty Extension Notifications
- **When**: Asset warranty is extended
- **Recipients**: Admin emails (configured in `ADMIN_EMAILS`)
- **Trigger**: Immediate (when warranty is extended)

## Installation

1. Install the required dependency:
```bash
npm install node-cron
```

2. Ensure your `.env` file has all the required environment variables

3. Restart your server - the cron job will start automatically

## Testing

To test email functionality:

1. **Test Subscription Renewal Reminder**:
   - Create a subscription with a due date 7, 3, or 0 days from today
   - Wait for the cron job to run (or manually trigger it)

2. **Test Action Notifications**:
   - Renew, pause, resume, or cancel a subscription
   - Check admin email inboxes for notifications

3. **Test Warranty Reminders**:
   - Create an asset with warranty end date 7, 3, or 0 days from today
   - Wait for the cron job to run

## Troubleshooting

### Emails Not Sending

1. **Check AWS Credentials**: Verify that `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` are correct
2. **Check SES Status**: Ensure your email address is verified in AWS SES
3. **Check Region**: Verify that `AWS_REGION` matches your SES configuration
4. **Check Logs**: Look for error messages in the server console

### Common Errors

- **"Email address is not verified"**: Your FROM_EMAIL must be verified in AWS SES
- **"Access Denied"**: Your AWS credentials don't have SES permissions
- **"Invalid region"**: The AWS_REGION doesn't match your SES setup

## Customization

### Change Reminder Schedule

Edit `SubscriptionsServices/reminder.cron.js`:
```javascript
// Change from daily at 9:00 AM to daily at 8:00 AM
cron.schedule("0 8 * * *", async () => {
  await runReminderCron();
});
```

### Change Reminder Days

Edit `SubscriptionsServices/reminder.cron.js`:
```javascript
// Change to 14, 7, 3, and 0 days
const REMINDER_DAYS = [14, 7, 3, 0];
```

### Customize Email Templates

Edit email templates in `SubscriptionsServices/email.service.js`:
- `sendSubscriptionRenewalReminder()`
- `sendAssetWarrantyExpirationReminder()`
- `sendSubscriptionActionNotification()`
- `sendAssetWarrantyExtensionNotification()`

## Notes

- Email sending failures do not block the main application functionality
- All email errors are logged to the console
- The cron job runs daily at 9:00 AM (configurable)
- Only active subscriptions with `notificationsEnabled: true` receive reminders


