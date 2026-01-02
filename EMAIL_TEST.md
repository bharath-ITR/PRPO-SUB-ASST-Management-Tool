# Email Testing Guide

This guide explains how to test the email functionality in the Subscriptions & Assets Management System.

## Test Endpoint

A test endpoint has been created at: `POST /api/subscriptions/test-email`

## How to Test

### Option 1: Using Postman or API Client

1. **Simple Test Email**
   ```json
   POST http://localhost:8080/api/subscriptions/test-email
   Content-Type: application/json
   
   {
     "email": "your-email@example.com"
   }
   ```

2. **Renewal Reminder Test Email**
   ```json
   POST http://localhost:8080/api/subscriptions/test-email
   Content-Type: application/json
   
   {
     "email": "your-email@example.com",
     "type": "renewal"
   }
   ```

3. **Action Notification Test Email**
   ```json
   POST http://localhost:8080/api/subscriptions/test-email
   Content-Type: application/json
   
   {
     "email": "your-email@example.com",
     "type": "action"
   }
   ```

### Option 2: Using cURL

**Simple Test:**
```bash
curl -X POST http://localhost:8080/api/subscriptions/test-email \
  -H "Content-Type: application/json" \
  -d '{"email": "your-email@example.com"}'
```

**Renewal Reminder Test:**
```bash
curl -X POST http://localhost:8080/api/subscriptions/test-email \
  -H "Content-Type: application/json" \
  -d '{"email": "your-email@example.com", "type": "renewal"}'
```

**Action Notification Test:**
```bash
curl -X POST http://localhost:8080/api/subscriptions/test-email \
  -H "Content-Type: application/json" \
  -d '{"email": "your-email@example.com", "type": "action"}'
```

### Option 3: Using Browser Console (Frontend)

Open browser console on the subscriptions page and run:

```javascript
fetch('http://localhost:8080/api/subscriptions/test-email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'your-email@example.com',
    type: 'simple' // or 'renewal' or 'action'
  })
})
.then(res => res.json())
.then(data => console.log('Email test result:', data))
.catch(err => console.error('Error:', err));
```

## Email Types

1. **Simple** (default): Basic test email to verify AWS SES configuration
2. **Renewal**: Tests the subscription renewal reminder email template
3. **Action**: Tests the subscription action notification email template

## Prerequisites

Before testing, ensure:

1. ✅ AWS SES credentials are configured in `.env`:
   ```env
   AWS_ACCESS_KEY_ID=your_access_key_id
   AWS_SECRET_ACCESS_KEY=your_secret_access_key
   AWS_REGION=us-east-2
   FROM_EMAIL=Marketing@itradiant1.com
   ```

2. ✅ The recipient email address is verified in AWS SES (for sandbox mode)
   - Go to AWS SES Console
   - Navigate to "Verified identities"
   - Add and verify the email address you want to test with

3. ✅ Server is running on the correct port (default: 8080)

## Expected Response

**Success:**
```json
{
  "success": true,
  "message": "Test email sent successfully",
  "result": {
    "success": true,
    "recipients": ["your-email@example.com"]
  },
  "recipient": "your-email@example.com",
  "type": "simple"
}
```

**Error:**
```json
{
  "success": false,
  "message": "Failed to send test email",
  "error": "Error message here",
  "details": "Check your AWS SES configuration and ensure the email address is verified in AWS SES"
}
```

## Troubleshooting

### Error: "Email address is not verified"
- **Solution**: Verify the email address in AWS SES Console
- In sandbox mode, you can only send to verified email addresses

### Error: "Access Denied"
- **Solution**: Check your AWS credentials and ensure they have SES permissions
- Verify `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` are correct

### Error: "Invalid region"
- **Solution**: Ensure `AWS_REGION` matches your SES configuration
- Default is `us-east-2`

### Network Error
- **Solution**: Ensure the server is running and accessible
- Check if CORS is properly configured

## Testing Real Scenarios

### Test Subscription Renewal Reminder
1. Create a subscription with an owner
2. Set the due date to 7, 3, or 0 days from today
3. Wait for the cron job to run (or manually trigger it)
4. Check the owner's email inbox

### Test Action Notifications
1. Create a subscription with an owner
2. Perform an action (renew, pause, resume, or cancel)
3. Check the owner's email inbox for the notification

## Notes

- In AWS SES sandbox mode, you can only send to verified email addresses
- To send to any email address, request production access in AWS SES
- Test emails are logged in the server console
- The cron job runs daily at 9:00 AM


