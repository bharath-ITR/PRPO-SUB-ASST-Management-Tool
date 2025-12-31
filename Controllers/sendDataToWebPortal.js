import EmailModel from "../Models/EmailModelSchema.js";

// controllers/emailController.js

/**
 * Fetch paginated email data for a given user.
 * - Supports pagination (10 items per page default).
 * - Filters by `To` array field.
 * - Returns only required fields.
 * - Handles edge cases: invalid page, no results, invalid email.
 */
// controllers/emailController.js

export const sendDataToWebPortal = async (req, res) => {
  try {
    const { email, search = "", fromDate, toDate } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (!email) {
      return res.status(400).json({ message: "Valid email is required" });
    }

    const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
    const limitNumber = Math.max(parseInt(limit, 10) || 10, 1);
    const skip = (pageNumber - 1) * limitNumber;

    // 🟢 Build dynamic query
    const query = { To: email };

    if (search) {
      query.$or = [
        { subject: { $regex: search, $options: "i" } },
        { PR_no: { $regex: search, $options: "i" } },
        { senderName: { $regex: search, $options: "i" } },
        { "body.productName": { $regex: search, $options: "i" } },
        { "body.sender_name": { $regex: search, $options: "i" } },
      ];
    }

    // 📅 Date filter
if (fromDate && toDate) {
  query.$expr = {
    $and: [
      {
        $gte: [
          {
            $dateFromString: {
              dateString: {
                $replaceAll: {
                  input: "$body.currentDate",
                  find: "-",
                  replacement: "/"
                }
              },
              format: "%m/%d/%Y"
            }
          },
          new Date(fromDate)
        ]
      },
      {
        $lte: [
          {
            $dateFromString: {
              dateString: {
                $replaceAll: {
                  input: "$body.currentDate",
                  find: "-",
                  replacement: "/"
                }
              },
              format: "%m/%d/%Y"
            }
          },
          new Date(toDate)
        ]
      }
    ]
  };
}


    const projection = `
  sender subject PR_no status dateSent isPOcreated isBlocked poDone activityLog
  poInvoice poInvoiceAttachments grQuantity grPartially grFully invoiceQuantity invoicePartially invoiceFully receiptFiles invoiceFiles
  productReceived invoiceUpload invoiceAttachments receiptUpload receiptAttachments receiptAmount paymentprocessType referenceNo
  body.usermail body.sender_name body.currentDate body.expectedDate
  body.purchaseType body.location body.productName body.productReason
  body.quantity body.productDescription body.unitPrice body.approxCost
  body.totalAmount body.currency body.paymentType body.comment
  body.attachment.filename body.attachment.originalname
  reportingToAndSupervisor.sendTo
  reportingToAndSupervisor.sendToName
  reportingToAndSupervisor.tokens
  reportingToAndSupervisor.Comment
  reportingToAndSupervisor.response
  reportingToAndSupervisor.updatedAt

`
      .replace(/\s+/g, " ")
      .trim();

    const [data, total] = await Promise.all([
      EmailModel.find(query)
        .select(projection)
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limitNumber)
        .lean(),
      EmailModel.countDocuments(query),
    ]);
    res.status(200).json({
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber) || 0,
      totalRecords: total,
      data,
    });
  } catch (error) {
    console.error("Error in sendDataToWebPortal:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* 
if (responseReportingTo === 'approved') {
  emailModel.status = 'in process';
  emailModel.To.push(finance);

  const userEmail = emailModel.sender;
  const statusMessage = `Your request has been approved by the ${username}.`;
  await sendStatusNotificationEmail(userEmail, username, statusMessage);

  // Handle additional workflow for an approved request
  await sendEmailToApprovers(finance, finance_name, username, productName, emailModel.PR_no, expectedDate, currentDate, quantity, approxCost);
  await emailModel.save();

  const responseFinance = await waitForResponse(emailModel.reportingToAndSupervisor[1].tokens, finance);
  console.log('finance', responseFinance);

  if (responseFinance === 'approved') {
    emailModel.status = 'processing';

    const userEmail = emailModel.sender;
    const statusMessage = `Your request has been approved by the ${username}.`;
    await sendStatusNotificationEmail(userEmail, username, statusMessage);

    // Additional workflow for approved requests, e.g., sending an email to higher_authority
    await sendEmailToApprovers(higher_authority, higher_authority_name, username, productName, emailModel.PR_no, expectedDate, currentDate, quantity, approxCost);
    emailModel.To.push(higher_authority);
    await emailModel.save();
  } else if (responseFinance === 'rejected') {
    emailModel.status = 'rejected';
    await emailModel.save();

    const userEmail = emailModel.sender;
    const statusMessage = `Your request has been rejected by the ${username}.`;
    await sendStatusNotificationEmail(userEmail, username, statusMessage);
  }
} else if (responseReportingTo === 'rejected') {
  emailModel.status = 'rejected';
  await emailModel.save();

  const userEmail = emailModel.sender;
  const statusMessage = `Your request has been rejected by the ${username}.`;
  await sendStatusNotificationEmail(userEmail, username, statusMessage);
} */
