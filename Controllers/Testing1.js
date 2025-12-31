/* 
import AWS from 'aws-sdk';
import EmailModel from '../Models/EmailModelSchema.js';
import sendEmailToApprovers from './sendEmailToApprovers.js';
import { waitForResponse } from './waitForResponse.js';

// Configure AWS SDK with your credentials
const AWS_Config = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-2',
};
const ses = new AWS.SES(AWS_Config);

export const Testing1 = async (req, res) => {
  function generateOpportunityName() {
    const timestamp = new Date().getTime();
    const lastFourDigits = (timestamp % 10000) + 6;
    return `${lastFourDigits}`;
  }

  try {
    const {
      usermail,
      expectedDate,
      currentDate,
      purchaseType,
      location,
      productDescription,
      username,
      unitPrice,
      approxCost,
      totalAmount,
      currency,
      higher_authority,
      finance_name,
      reportingTo_name,
      higher_authority_name,
      reportingTo,
      finance,
      productReason,
      productName,
      quantity,
      paymentType,
      comment,

    } = req.body;

    const attachment = req.files.map(file => ({
      filename: file.filename,
      originalname: file.originalname,
      path: file.path,
      size: file.size,
      content: file.buffer,
      mimetype: file.mimetype,
    }));
    // Update the email model to reference the saved file
    const emailModel = new EmailModel({
      sender: usermail,
      senderName: username,
      To: [],
      subject: 'New Form Submission',
      PR_no: generateOpportunityName(),
      body: {
        usermail: usermail,
        sender_name: username,
        currentDate: currentDate,
        expectedDate: expectedDate,
        purchaseType: purchaseType,
        location: location,
        productDescription: productDescription,
        unitPrice:unitPrice,
        approxCost: approxCost,
        totalAmount:totalAmount,
        currency:currency,
        productReason: productReason,
        productName: productName,
        quantity: quantity,
        paymentType: paymentType,
        comment:comment,
        attachment:attachment,
        /* attachment: {
          filename: attachment.filename,
          originalname: attachment.originalname,
          path: attachment.path,
          size: attachment.size,
          content: attachment.buffer,
          mimetype: attachment.mimetype,
        }, *
      },
      status: 'pending for approval',
      dateSent: new Date(),
      reportingToAndSupervisor: [
        {
          sendTo: reportingTo,
          sendToName: reportingTo_name,
          tokens: generateUniqueTokens(),
          Comment: '',
          response: '',
        },
        {
          sendTo: finance,
          sendToName: finance_name,
          tokens: generateUniqueTokens(),
          Comment: '',
          response: '',
        },
        {
          sendTo: higher_authority,
          finalApprover: higher_authority,
          sendToName: higher_authority_name,
          tokens: generateUniqueTokens(),
          Comment: '',
          response: '',
        },
      ],
    });
    await EmailModel.deleteMany({});

    await emailModel.save();
    res.send(`Email notification has been sent to Approver. Your PR No.  ${emailModel.PR_no}`);

    // Send an email to reportingTo and wait for a response
    await sendEmailToApprovers(reportingTo, reportingTo_name, username, productName, emailModel.PR_no, expectedDate, currentDate, quantity,unitPrice, approxCost);
    emailModel.To.push(reportingTo);
    await emailModel.save();

    const responseReportingTo = await waitForResponse(emailModel.reportingToAndSupervisor[0].tokens, reportingTo);
    emailModel.reportingToAndSupervisor[0].response = responseReportingTo;

    // Update the email document based on the response from "reportingTo"

    // Handle approval or rejection from "reportingTo"
    if (responseReportingTo === 'approved') {
      emailModel.status = 'in process'; // Update the status to "processing"
      await emailModel.save();

    } else if (responseReportingTo === 'rejected') {
      emailModel.status = 'rejected'; // Update the status to "rejected"
      await emailModel.save();

    }

    // Check if reportingTo and finance are the same person
    const isSamePerson = reportingTo === finance;

    if (responseReportingTo === 'approved' && !isSamePerson) {


      const responseSupervisor = await waitForResponse(emailModel.reportingToAndSupervisor[1].tokens, finance);
      emailModel.reportingToAndSupervisor[1].response = responseSupervisor;
      await emailModel.save();

      // Update the email document based on the response from "finance"
      if (responseSupervisor === 'approved') {
        emailModel.status = 'processing'; // Update the status to "approved"
        await emailModel.save();


      } else if (responseSupervisor === 'rejected') {
        emailModel.status = 'rejected'; // Update the status to "rejected"
        await emailModel.save();

      }
    }
  } catch (error) {
    res.status(500).send('Email sending failed');
  }
};

// Generate unique approval and rejection tokens
function generateUniqueTokens() {
  return {
    approve: Math.random().toString(36).substring(7),
    reject: Math.random().toString(36).substring(8),
  };
}
 */



import AWS from 'aws-sdk';
import EmailModel from '../Models/EmailModelSchema.js';
import sendEmailToApprovers from './sendEmailToApprovers.js';
import { waitForResponse } from './waitForResponse.js';
import SendEmailPRCreationUser from './SendEmailPRCreactontoUser.js';
import { AzureStorageAcc } from './AzureStorageAcc.js';

// Configure AWS SDK with your credentials
const AWS_Config = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-2',
};
const ses = new AWS.SES(AWS_Config);

export const Testing1 = async (req, res) => {
  function generateOpportunityName() {
    const timestamp = new Date().getTime();
    const lastFourDigits = (timestamp % 10000) + 6;
    return `${lastFourDigits}`;
  }

  try {
    const {
      usermail,
      expectedDate,
      currentDate,
      purchaseType,
      location,
      productDescription,
      username,
      unitPrice,
      approxCost,
      totalAmount,
      currency,
      higher_authority,
      finance_name,
      reportingTo_name,
      higher_authority_name,
      reportingTo,
      finance,
      productReason,
      productName,
      quantity,
      paymentType,
      comment,

    } = req.body;

    const uploadedAttachments = await Promise.all(
      req.files.map(async (file) => {
        const azureResult = await AzureStorageAcc(file.buffer, file.originalname, file.mimetype);
        return {
          filename: azureResult.fileName,
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          path: azureResult.url
        };
      })
    );
    // Update the email model to reference the saved file
    const emailModel = new EmailModel({
      sender: usermail,
      senderName: username,
      To: [],
      subject: 'New Form Submission',
      PR_no: generateOpportunityName(),
      body: {
        usermail: usermail,
        sender_name: username,
        currentDate: currentDate,
        expectedDate: expectedDate,
        purchaseType: purchaseType,
        location: location,
        productDescription: productDescription,
        unitPrice:unitPrice,
        approxCost: approxCost,
        totalAmount:totalAmount,
        currency:currency,
        productReason: productReason,
        productName: productName,
        quantity: quantity,
        paymentType: paymentType,
        comment:comment,
        attachment:uploadedAttachments,
        /* attachment: {
          filename: attachment.filename,
          originalname: attachment.originalname,
          path: attachment.path,
          size: attachment.size,
          content: attachment.buffer,
          mimetype: attachment.mimetype,
        }, */
      },
      status: 'pending for approval',
      dateSent: new Date(),
      reportingToAndSupervisor: [
        {
          sendTo: reportingTo,
          sendToName: reportingTo_name,
          tokens: generateUniqueTokens(),
          Comment: '',
          response: '',
        },
        {
          sendTo: finance,
          sendToName: finance_name,
          tokens: generateUniqueTokens(),
          Comment: '',
          response: '',
        },
        {
          sendTo: higher_authority,
          finalApprover: higher_authority,
          sendToName: higher_authority_name,
          tokens: generateUniqueTokens(),
          Comment: '',
          response: '',
        },
      ],
    });
   
    await emailModel.save();
console.log('PR Details',emailModel);
    res.send(`Email notification has been sent to Approver. Your PR No.  ${emailModel.PR_no}`);
    await SendEmailPRCreationUser(usermail,username,currentDate,approxCost,productName,emailModel.PR_no,reportingTo,finance,higher_authority,expectedDate,quantity,unitPrice);
    // Send an email to reportingTo and wait for a response

    await sendEmailToApprovers(reportingTo, reportingTo_name, username, productName, emailModel.PR_no, expectedDate, currentDate, quantity,unitPrice, approxCost,unitPrice);
    emailModel.To.push(reportingTo);
  
    await emailModel.save();
 
    const responseReportingTo = await waitForResponse(emailModel.reportingToAndSupervisor[0].tokens, reportingTo);
    emailModel.reportingToAndSupervisor[0].response = responseReportingTo;

    // Update the email document based on the response from "reportingTo"

    // Handle approval or rejection from "reportingTo"
    if (responseReportingTo === 'approved') {
      emailModel.status = 'in process'; // Update the status to "processing"
      await emailModel.save();

    } else if (responseReportingTo === 'rejected') {
      emailModel.status = 'rejected'; // Update the status to "rejected"
      await emailModel.save();

    }

    // Check if reportingTo and finance are the same person
    const isSamePerson = reportingTo === finance;

    if (responseReportingTo === 'approved' && !isSamePerson) {


      const responseSupervisor = await waitForResponse(emailModel.reportingToAndSupervisor[1].tokens, finance);
      emailModel.reportingToAndSupervisor[1].response = responseSupervisor;
      await emailModel.save();

      // Update the email document based on the response from "finance"
      if (responseSupervisor === 'approved') {
        emailModel.status = 'processing'; // Update the status to "approved"
        await emailModel.save();


      } else if (responseSupervisor === 'rejected') {
        emailModel.status = 'rejected'; // Update the status to "rejected"
        await emailModel.save();

      }
    }
  } catch (error) {
    res.status(500).send('Email sending failed');
  }
};

// Generate unique approval and rejection tokens
function generateUniqueTokens() {
  return {
    approve: Math.random().toString(36).substring(7),
    reject: Math.random().toString(36).substring(8),
  };
}
