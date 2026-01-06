import AWS from "aws-sdk";

const AWS_Config = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-2',
};

const ses = new AWS.SES(AWS_Config);
const FROM_EMAIL = process.env.FROM_EMAIL || "Marketing@itradiant1.com";
const ADMIN_EMAILS = process.env.ADMIN_EMAILS 
  ? process.env.ADMIN_EMAILS.split(",").map(email => email.trim())
  : ["Marketing@itradiant1.com"];

/**
 * Send email using AWS SES
 * @param {string|string[]} to - Recipient email(s)
 * @param {string} subject - Email subject
 * @param {string} htmlBody - HTML email body
 * @param {string} textBody - Plain text email body (optional)
 * @returns {Promise}
 */
export const sendEmail = async (to, subject, htmlBody, textBody = null) => {
  try {
    const recipients = Array.isArray(to) ? to : [to];
    
    const mailOptions = {
      Source: FROM_EMAIL,
      Destination: {
        ToAddresses: recipients,
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: "UTF-8",
        },
        Body: {
          Html: {
            Data: htmlBody,
            Charset: "UTF-8",
          },
          ...(textBody && {
            Text: {
              Data: textBody,
              Charset: "UTF-8",
            },
          }),
        },
      },
    };

    await ses.sendEmail(mailOptions).promise();
    console.log(`✅ Email sent successfully to: ${recipients.join(", ")}`);
    return { success: true, recipients };
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

// Helpers: collect owners/emails (supports single owner fallback)
const getOwnerList = (subscription) => {
  return subscription?.owners?.length
    ? subscription.owners
    : (subscription?.owner ? [subscription.owner] : []);
};

const getOwnerEmails = (subscription) => {
  return getOwnerList(subscription)
    .filter((o) => o && o.email)
    .map((o) => o.email);
};

// Greeting: if single owner, use their name/email; if multiple, use Team
const getGreetingName = (subscription) => {
  const owners = getOwnerList(subscription);
  if (owners.length === 1) {
    return owners[0].name || owners[0].email || "Team";
  }
  return "Team";
};

// Build Outlook-friendly HTML for subscription renewal reminder
const buildSubscriptionRenewalHtml = (subscription, daysLeft, greetingName) => {
  const dueDate = new Date(subscription.dueDate).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const subjectText = `Subscription Renewal Reminder: ${subscription.name} - ${daysLeft} day(s) remaining`;

  const html = `
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
                  <h2 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">🔔 Subscription Renewal Reminder</h2>
                </td>
              </tr>
              <!-- Content -->
              <tr>
                <td style="padding: 30px 20px; background-color: #ffffff;">
                  <p style="margin: 0 0 15px 0; font-size: 16px; color: #333333; line-height: 1.6;">Dear ${greetingName},</p>
                  <p style="margin: 0 0 20px 0; font-size: 16px; color: #333333; line-height: 1.6;">This is a reminder that the following subscription is due for renewal:</p>
                  
                  <!-- Info Box -->
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f9f9f9; border-left: 4px solid #667eea; margin: 20px 0;">
                    <tr>
                      <td style="padding: 20px;">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td style="padding: 8px 0;">
                              <strong style="color: #555555; font-size: 14px;">Subscription Name:</strong>
                              <span style="color: #333333; font-size: 14px; margin-left: 10px;">${subscription.name}</span>
                            </td>
                          </tr>
                          ${subscription.vendor ? `
                          <tr>
                            <td style="padding: 8px 0;">
                              <strong style="color: #555555; font-size: 14px;">Vendor:</strong>
                              <span style="color: #333333; font-size: 14px; margin-left: 10px;">${subscription.vendor}</span>
                            </td>
                          </tr>
                          ` : ""}
                          <tr>
                            <td style="padding: 8px 0;">
                              <strong style="color: #555555; font-size: 14px;">Billing Cycle:</strong>
                              <span style="color: #333333; font-size: 14px; margin-left: 10px;">${subscription.billingCycle}</span>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0;">
                              <strong style="color: #555555; font-size: 14px;">Current Cost:</strong>
                              <span style="color: #333333; font-size: 14px; margin-left: 10px;">${subscription.costCurrency || "₹"} ${subscription.cost}</span>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0;">
                              <strong style="color: #555555; font-size: 14px;">Next Renewal Date:</strong>
                              <span style="color: #333333; font-size: 14px; margin-left: 10px;">${dueDate}</span>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0;">
                              <strong style="color: #555555; font-size: 14px;">Status:</strong>
                              <span style="color: #333333; font-size: 14px; margin-left: 10px;">${subscription.status || "ACTIVE"}</span>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- Warning Box -->
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fff3cd; border-left: 4px solid #ffc107; margin: 20px 0;">
                    <tr>
                      <td style="padding: 20px;">
                        <p style="margin: 0; font-size: 16px; color: #856404; line-height: 1.6;">
                          <strong>⚠️ Action Required:</strong> This subscription will renew in <strong>${daysLeft} day(s)</strong>. 
                          Please review and take necessary action before the renewal date.
                        </p>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 20px 0 0 0; font-size: 16px; color: #333333; line-height: 1.6;">Please ensure that the subscription is reviewed and renewed if needed.</p>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="padding: 20px; background-color: #f9f9f9; text-align: center;">
                  <p style="margin: 0 0 5px 0; font-size: 12px; color: #777777;">This is an automated notification from Subscriptions & Assets Management System.</p>
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

  return { html, subjectText, dueDate };
};

/**
 * Send subscription renewal reminder email
 */
export const sendSubscriptionRenewalReminder = async (
  subscription,
  daysLeft,
  recipientEmails = null
) => {
  // Only send to owners - if none, don't send email
  const owners = getOwnerList(subscription).filter((o) => o && o.email);
  const ownerEmails = owners.map((o) => o.email);

  const recipients = recipientEmails && recipientEmails.length
    ? recipientEmails
    : ownerEmails;

  if (!recipients || !recipients.length) {
    console.log(`⚠️ Skipping email for subscription "${subscription.name}" - no owners assigned`);
    return { success: false, message: "No owners assigned" };
  }

  const { subjectText, dueDate } = buildSubscriptionRenewalHtml(
    subscription,
    daysLeft,
    "Team"
  );

  const textBody = `
Subscription Renewal Reminder: ${subscription.name}

This subscription is due for renewal in ${daysLeft} day(s).

Details:
- Subscription Name: ${subscription.name}
${subscription.vendor ? `- Vendor: ${subscription.vendor}\n` : ""}- Billing Cycle: ${subscription.billingCycle}
- Current Cost: ${subscription.costCurrency || "₹"} ${subscription.cost}
- Next Renewal Date: ${dueDate}
- Status: ${subscription.status || "ACTIVE"}

Please review and take necessary action before the renewal date.
  `;

  // If we have multiple owners and we're not forcing a specific recipient list,
  // send a personalized email to each owner.
  if (!recipientEmails && owners.length > 1) {
    const sentTo = [];
    for (const owner of owners) {
      const greetingName = owner.name || owner.email || "Team";
      const { html } = buildSubscriptionRenewalHtml(
        subscription,
        daysLeft,
        greetingName
      );
      await sendEmail(owner.email, subjectText, html, textBody);
      sentTo.push(owner.email);
    }
    return { success: true, recipients: sentTo };
  }

  // Single recipient (or explicit test recipient list) – personalize if possible
  let greetingName = "Team";
  if (recipients.length === 1) {
    const match =
      owners.find((o) => o.email === recipients[0]) || owners[0];
    if (match) {
      greetingName = match.name || match.email || "Team";
    }
  } else {
    greetingName = getGreetingName(subscription);
  }

  const { html } = buildSubscriptionRenewalHtml(
    subscription,
    daysLeft,
    greetingName
  );

  return await sendEmail(recipients, subjectText, html, textBody);
};

/**
 * Send asset warranty expiration reminder email
 */
export const sendAssetWarrantyExpirationReminder = async (
  asset,
  daysLeft,
  recipientEmails = null
) => {
  const recipients = recipientEmails || ADMIN_EMAILS;
  const warrantyEnd = new Date(asset.warrantyEnd).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const subject = `Asset Warranty Expiration Reminder: ${asset.name} - ${daysLeft} day(s) remaining`;

  // Outlook-compatible HTML email template
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
                <td style="background-color: #f5576c; padding: 30px 20px; text-align: center;">
                  <h2 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">⚠️ Asset Warranty Expiration Reminder</h2>
                </td>
              </tr>
              <!-- Content -->
              <tr>
                <td style="padding: 30px 20px; background-color: #ffffff;">
                  <p style="margin: 0 0 15px 0; font-size: 16px; color: #333333; line-height: 1.6;">Dear Team,</p>
                  <p style="margin: 0 0 20px 0; font-size: 16px; color: #333333; line-height: 1.6;">This is a reminder that the following asset's warranty is expiring soon:</p>
                  
                  <!-- Info Box -->
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f9f9f9; border-left: 4px solid #f5576c; margin: 20px 0;">
                    <tr>
                      <td style="padding: 20px;">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td style="padding: 8px 0;">
                              <strong style="color: #555555; font-size: 14px;">Asset Name:</strong>
                              <span style="color: #333333; font-size: 14px; margin-left: 10px;">${asset.name}</span>
                            </td>
                          </tr>
                          ${asset.type ? `
                          <tr>
                            <td style="padding: 8px 0;">
                              <strong style="color: #555555; font-size: 14px;">Asset Type:</strong>
                              <span style="color: #333333; font-size: 14px; margin-left: 10px;">${asset.type}</span>
                            </td>
                          </tr>
                          ` : ""}
                          ${asset.assignedTo ? `
                          <tr>
                            <td style="padding: 8px 0;">
                              <strong style="color: #555555; font-size: 14px;">Assigned To:</strong>
                              <span style="color: #333333; font-size: 14px; margin-left: 10px;">${asset.assignedTo}</span>
                            </td>
                          </tr>
                          ` : ""}
                          <tr>
                            <td style="padding: 8px 0;">
                              <strong style="color: #555555; font-size: 14px;">Warranty End Date:</strong>
                              <span style="color: #333333; font-size: 14px; margin-left: 10px;">${warrantyEnd}</span>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0;">
                              <strong style="color: #555555; font-size: 14px;">Status:</strong>
                              <span style="color: #333333; font-size: 14px; margin-left: 10px;">${asset.status || "ACTIVE"}</span>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- Warning Box -->
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fff3cd; border-left: 4px solid #ffc107; margin: 20px 0;">
                    <tr>
                      <td style="padding: 20px;">
                        <p style="margin: 0; font-size: 16px; color: #856404; line-height: 1.6;">
                          <strong>⚠️ Action Required:</strong> This asset's warranty will expire in <strong>${daysLeft} day(s)</strong>. 
                          Please review and consider extending the warranty if needed.
                        </p>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 20px 0 0 0; font-size: 16px; color: #333333; line-height: 1.6;">Please ensure that the asset warranty is reviewed and extended if necessary.</p>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="padding: 20px; background-color: #f9f9f9; text-align: center;">
                  <p style="margin: 0 0 5px 0; font-size: 12px; color: #777777;">This is an automated notification from Subscriptions & Assets Management System.</p>
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
Asset Warranty Expiration Reminder: ${asset.name}

This asset's warranty is expiring in ${daysLeft} day(s).

Details:
- Asset Name: ${asset.name}
${asset.type ? `- Asset Type: ${asset.type}\n` : ""}${asset.assignedTo ? `- Assigned To: ${asset.assignedTo}\n` : ""}- Warranty End Date: ${warrantyEnd}
- Status: ${asset.status || "ACTIVE"}

Please review and consider extending the warranty if needed.
  `;

  return await sendEmail(recipients, subject, htmlBody, textBody);
};

// Build Outlook-friendly HTML for subscription action notification
const buildSubscriptionActionHtml = (subscription, actionLabel, dueDate, greetingName) => {
  const html = `
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
                  <h2 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">📧 Subscription ${actionLabel}</h2>
                </td>
              </tr>
              <!-- Content -->
              <tr>
                <td style="padding: 30px 20px; background-color: #ffffff;">
                  <p style="margin: 0 0 15px 0; font-size: 16px; color: #333333; line-height: 1.6;">Dear ${greetingName},</p>
                  <p style="margin: 0 0 20px 0; font-size: 16px; color: #333333; line-height: 1.6;">The following subscription has been <strong>${actionLabel.toLowerCase()}</strong>:</p>
                  
                  <!-- Info Box -->
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f9f9f9; border-left: 4px solid #667eea; margin: 20px 0;">
                    <tr>
                      <td style="padding: 20px;">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td style="padding: 8px 0;">
                              <strong style="color: #555555; font-size: 14px;">Subscription Name:</strong>
                              <span style="color: #333333; font-size: 14px; margin-left: 10px;">${subscription.name}</span>
                            </td>
                          </tr>
                          ${subscription.vendor ? `
                          <tr>
                            <td style="padding: 8px 0;">
                              <strong style="color: #555555; font-size: 14px;">Vendor:</strong>
                              <span style="color: #333333; font-size: 14px; margin-left: 10px;">${subscription.vendor}</span>
                            </td>
                          </tr>
                          ` : ""}
                          <tr>
                            <td style="padding: 8px 0;">
                              <strong style="color: #555555; font-size: 14px;">Billing Cycle:</strong>
                              <span style="color: #333333; font-size: 14px; margin-left: 10px;">${subscription.billingCycle}</span>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0;">
                              <strong style="color: #555555; font-size: 14px;">Cost:</strong>
                              <span style="color: #333333; font-size: 14px; margin-left: 10px;">${subscription.costCurrency || "₹"} ${subscription.cost}</span>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0;">
                              <strong style="color: #555555; font-size: 14px;">Next Renewal Date:</strong>
                              <span style="color: #333333; font-size: 14px; margin-left: 10px;">${dueDate}</span>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0;">
                              <strong style="color: #555555; font-size: 14px;">Status:</strong>
                              <span style="color: #333333; font-size: 14px; margin-left: 10px;">${subscription.status}</span>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- Success Box -->
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #d4edda; border-left: 4px solid #28a745; margin: 20px 0;">
                    <tr>
                      <td style="padding: 20px;">
                        <p style="margin: 0; font-size: 16px; color: #155724; line-height: 1.6;">
                          <strong>✅ Action Completed:</strong> The subscription has been successfully ${actionLabel.toLowerCase()}.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="padding: 20px; background-color: #f9f9f9; text-align: center;">
                  <p style="margin: 0 0 5px 0; font-size: 12px; color: #777777;">This is an automated notification from Subscriptions & Assets Management System.</p>
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

  return html;
};

/**
 * Send subscription action notification (renew, pause, resume, cancel)
 */
export const sendSubscriptionActionNotification = async (
  subscription,
  action,
  recipientEmails = null
) => {
  // Only send to owners - if none, don't send email
  const owners = getOwnerList(subscription).filter((o) => o && o.email);
  const ownerEmails = owners.map((o) => o.email);

  const recipients = recipientEmails && recipientEmails.length
    ? recipientEmails
    : ownerEmails;

  if (!recipients || !recipients.length) {
    console.log(`⚠️ Skipping email for subscription "${subscription.name}" - no owners assigned`);
    return { success: false, message: "No owners assigned" };
  }

  const actionLabels = {
    renewed: "Renewed",
    paused: "Paused",
    resumed: "Resumed",
    cancelled: "Cancelled",
  };

  const actionLabel = actionLabels[action.toLowerCase()] || action;
  const subject = `Subscription ${actionLabel}: ${subscription.name}`;

  const dueDate = subscription.dueDate
    ? new Date(subscription.dueDate).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  const textBody = `
Subscription ${actionLabel}: ${subscription.name}

The subscription has been ${actionLabel.toLowerCase()}.

Details:
- Subscription Name: ${subscription.name}
${subscription.vendor ? `- Vendor: ${subscription.vendor}\n` : ""}- Billing Cycle: ${subscription.billingCycle}
- Cost: ${subscription.costCurrency || "₹"} ${subscription.cost}
- Next Renewal Date: ${dueDate}
- Status: ${subscription.status}
  `;

  // If we have multiple owners and we're not forcing a specific recipient list,
  // send a personalized email to each owner.
  if (!recipientEmails && owners.length > 1) {
    const sentTo = [];
    for (const owner of owners) {
      const greetingName = owner.name || owner.email || "Team";
      const html = buildSubscriptionActionHtml(
        subscription,
        actionLabel,
        dueDate,
        greetingName
      );
      await sendEmail(owner.email, subject, html, textBody);
      sentTo.push(owner.email);
    }
    return { success: true, recipients: sentTo };
  }

  // Single recipient (or explicit test recipient list) – personalize if possible
  let greetingName = "Team";
  if (recipients.length === 1) {
    const match =
      owners.find((o) => o.email === recipients[0]) || owners[0];
    if (match) {
      greetingName = match.name || match.email || "Team";
    }
  } else {
    greetingName = getGreetingName(subscription);
  }

  const html = buildSubscriptionActionHtml(
    subscription,
    actionLabel,
    dueDate,
    greetingName
  );

  return await sendEmail(recipients, subject, html, textBody);
};

/**
 * Send asset warranty extension notification
 */
export const sendAssetWarrantyExtensionNotification = async (
  asset,
  extendedMonths,
  recipientEmails = null
) => {
  const recipients = recipientEmails || ADMIN_EMAILS;
  const warrantyEnd = new Date(asset.warrantyEnd).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const subject = `Asset Warranty Extended: ${asset.name}`;

  // Outlook-compatible HTML email template
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
                <td style="background-color: #f5576c; padding: 30px 20px; text-align: center;">
                  <h2 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">✅ Asset Warranty Extended</h2>
                </td>
              </tr>
              <!-- Content -->
              <tr>
                <td style="padding: 30px 20px; background-color: #ffffff;">
                  <p style="margin: 0 0 15px 0; font-size: 16px; color: #333333; line-height: 1.6;">Dear Team,</p>
                  <p style="margin: 0 0 20px 0; font-size: 16px; color: #333333; line-height: 1.6;">The warranty for the following asset has been extended:</p>
                  
                  <!-- Info Box -->
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f9f9f9; border-left: 4px solid #f5576c; margin: 20px 0;">
                    <tr>
                      <td style="padding: 20px;">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td style="padding: 8px 0;">
                              <strong style="color: #555555; font-size: 14px;">Asset Name:</strong>
                              <span style="color: #333333; font-size: 14px; margin-left: 10px;">${asset.name}</span>
                            </td>
                          </tr>
                          ${asset.type ? `
                          <tr>
                            <td style="padding: 8px 0;">
                              <strong style="color: #555555; font-size: 14px;">Asset Type:</strong>
                              <span style="color: #333333; font-size: 14px; margin-left: 10px;">${asset.type}</span>
                            </td>
                          </tr>
                          ` : ""}
                          ${asset.assignedTo ? `
                          <tr>
                            <td style="padding: 8px 0;">
                              <strong style="color: #555555; font-size: 14px;">Assigned To:</strong>
                              <span style="color: #333333; font-size: 14px; margin-left: 10px;">${asset.assignedTo}</span>
                            </td>
                          </tr>
                          ` : ""}
                          <tr>
                            <td style="padding: 8px 0;">
                              <strong style="color: #555555; font-size: 14px;">Extended For:</strong>
                              <span style="color: #333333; font-size: 14px; margin-left: 10px;">${extendedMonths} month(s)</span>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0;">
                              <strong style="color: #555555; font-size: 14px;">New Warranty End Date:</strong>
                              <span style="color: #333333; font-size: 14px; margin-left: 10px;">${warrantyEnd}</span>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0;">
                              <strong style="color: #555555; font-size: 14px;">Status:</strong>
                              <span style="color: #333333; font-size: 14px; margin-left: 10px;">${asset.status || "ACTIVE"}</span>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- Success Box -->
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #d4edda; border-left: 4px solid #28a745; margin: 20px 0;">
                    <tr>
                      <td style="padding: 20px;">
                        <p style="margin: 0; font-size: 16px; color: #155724; line-height: 1.6;">
                          <strong>✅ Warranty Extended:</strong> The asset warranty has been successfully extended by ${extendedMonths} month(s).
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="padding: 20px; background-color: #f9f9f9; text-align: center;">
                  <p style="margin: 0 0 5px 0; font-size: 12px; color: #777777;">This is an automated notification from Subscriptions & Assets Management System.</p>
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
Asset Warranty Extended: ${asset.name}

The warranty has been extended by ${extendedMonths} month(s).

Details:
- Asset Name: ${asset.name}
${asset.type ? `- Asset Type: ${asset.type}\n` : ""}${asset.assignedTo ? `- Assigned To: ${asset.assignedTo}\n` : ""}- Extended For: ${extendedMonths} month(s)
- New Warranty End Date: ${warrantyEnd}
- Status: ${asset.status || "ACTIVE"}
  `;

  return await sendEmail(recipients, subject, htmlBody, textBody);
};

export default {
  sendEmail,
  sendSubscriptionRenewalReminder,
  sendAssetWarrantyExpirationReminder,
  sendSubscriptionActionNotification,
  sendAssetWarrantyExtensionNotification,
};

