/* 

import AWS from 'aws-sdk';
import EmailModel from '../Models/EmailModelSchema.js';
import { sendStatusNotificationEmail } from './EmailToUser.js';
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
    const { usermail, expectedDate, currentDate, purchaseType, location, productDescription, username, approxCost, higher_authority, finance_name, reportingTo_name, higher_authority_name, reportingTo, finance, productReason, productName, quantity, paymentType } = req.body;
   
    const attachment = req.file;
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
        approxCost: approxCost,
        productReason: productReason,
        productName: productName,
        quantity: quantity,
        paymentType: paymentType,
        attachment: {
          filename: attachment.filename,
          originalname: attachment.originalname,
          path: attachment.path,
          size: attachment.size,
          content: attachment.buffer,
          mimetype: attachment.mimetype,
        }
      },
      status: 'pending for approval',
      dateSent: new Date(),
      reportingToAndSupervisor: [
        {
          sendTo: reportingTo,
          sendToName:reportingTo_name,
          tokens: generateUniqueTokens(),
          Comment: '',
          response: '',
        },
        {
          sendTo: finance,
          sendToName:finance_name,
          tokens: generateUniqueTokens(),
          Comment: '',
          response: '',
        },
        {
          sendTo: higher_authority,
          sendToName:higher_authority_name,
          tokens: generateUniqueTokens(),
          Comment: '',
          response: '',
        },
      ],
    });
    await EmailModel.deleteMany({});
    await emailModel.save();

    res.send('Email document created successfully');

    // Send an email to reportingTo and wait for a response
    await sendEmailToApprovers(reportingTo,reportingTo_name, username, productName, emailModel.PR_no, expectedDate, currentDate, quantity, approxCost);
    emailModel.To.push(reportingTo);
    await emailModel.save();

    const responseReportingTo = await waitForResponse(emailModel.reportingToAndSupervisor[0].tokens,reportingTo);
    emailModel.reportingToAndSupervisor[0].response = responseReportingTo;

    // Update the email document based on the response from "reportingTo"

    // Handle approval or rejection from "reportingTo"
    if (responseReportingTo === 'approved') {
      emailModel.status = 'in process'; // Update the status to "processing"
      await emailModel.save();

      // Send a status notification email to the user
      const userEmail = emailModel.sender;
      const statusMessage = `Your request has been approved by the ${reportingTo_name}.`;
      await sendStatusNotificationEmail(userEmail,reportingTo_name, statusMessage);
    } else if (responseReportingTo === 'rejected') {
      emailModel.status = 'rejected'; // Update the status to "rejected"
      await emailModel.save();

      // Send a status notification email to the user
      const userEmail = emailModel.sender;
      const statusMessage = `Your request has been rejected by the ${reportingTo_name}.`;
      await sendStatusNotificationEmail(userEmail,reportingTo_name, statusMessage);
    }

    if (responseReportingTo === 'approved') {
      // Handle additional workflow for an approved request

      // Send an email to finance and wait for a response
      await sendEmailToApprovers(finance,finance_name, username, productName, emailModel.PR_no, expectedDate, currentDate, quantity, approxCost);
      await emailModel.save();

      const responseSupervisor = await waitForResponse(emailModel.reportingToAndSupervisor[1].tokens,finance);
      emailModel.reportingToAndSupervisor[1].response = responseSupervisor;

      // Update the email document based on the response from "finance"
      if (responseSupervisor === 'approved') {
        emailModel.status = 'processing'; // Update the status to "approved"
        await emailModel.save();

        // Send a status notification email to the user
        const userEmail = emailModel.sender;
        const statusMessage = `Your request has been approved by the ${finance_name}.`;
        await sendStatusNotificationEmail(userEmail,finance_name, statusMessage);

        // Additional workflow for approved requests, e.g., sending an email to higher_authority
        await sendEmailToApprovers(higher_authority,higher_authority_name, username, productName, emailModel.PR_no, expectedDate, currentDate, quantity, approxCost);
        await emailModel.save();

      } else if (responseSupervisor === 'rejected') {
        emailModel.status = 'rejected'; // Update the status to "rejected"
        await emailModel.save();

        // Send a status notification email to the user
        const userEmail = emailModel.sender;
        const statusMessage = `Your request has been rejected by the ${finance_name}.`;
        await sendStatusNotificationEmail(userEmail,finance_name, statusMessage);
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
} */


import AWS from 'aws-sdk';
import EmailModel from '../Models/EmailModelSchema.js';
import { sendStatusNotificationEmail } from './EmailToUser.js';
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
      approxCost,
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
    } = req.body;

    const attachment = req.file;
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
        approxCost: approxCost,
        productReason: productReason,
        productName: productName,
        quantity: quantity,
        paymentType: paymentType,
        attachment: {
          filename: attachment.filename,
          originalname: attachment.originalname,
          path: attachment.path,
          size: attachment.size,
          content: attachment.buffer,
          mimetype: attachment.mimetype,
        },
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
          sendToName: higher_authority_name,
          tokens: generateUniqueTokens(),
          Comment: '',
          response: '',
        },
      ],
    });
    await EmailModel.deleteMany({});
    await emailModel.save();

    res.send('Email document created successfully');

    // Send an email to reportingTo and wait for a response
    await sendEmailToApprovers(reportingTo, reportingTo_name, username, productName, emailModel.PR_no, expectedDate, currentDate, quantity, approxCost);
    emailModel.To.push(reportingTo);
    await emailModel.save();

    const responseReportingTo = await waitForResponse(emailModel.reportingToAndSupervisor[0].tokens, reportingTo);
    emailModel.reportingToAndSupervisor[0].response = responseReportingTo;

    // Update the email document based on the response from "reportingTo"

    // Handle approval or rejection from "reportingTo"
    if (responseReportingTo === 'approved') {
      emailModel.status = 'in process'; // Update the status to "processing"
      await emailModel.save();

      // Send a status notification email to the user
     /*  const userEmail = emailModel.sender;
      const statusMessage = `Your request has been approved by the ${reportingTo_name}.`;
      await sendStatusNotificationEmail(userEmail, reportingTo_name, statusMessage); */
    } else if (responseReportingTo === 'rejected') {
      emailModel.status = 'rejected'; // Update the status to "rejected"
      await emailModel.save();

      // Send a status notification email to the user
      /* const userEmail = emailModel.sender;
      const statusMessage = `Your request has been rejected by the ${reportingTo_name}.`;
      await sendStatusNotificationEmail(userEmail, reportingTo_name, statusMessage); */
    }

    // Check if reportingTo and finance are the same person
    const isSamePerson = reportingTo === finance;

    if (responseReportingTo === 'approved' && !isSamePerson) {
      // Handle additional workflow for an approved request

      // Send an email to finance and wait for a response
    /*   await sendEmailToApprovers(finance, finance_name, username, productName, emailModel.PR_no, expectedDate, currentDate, quantity, approxCost); */
      await emailModel.save();

      const responseSupervisor = await waitForResponse(emailModel.reportingToAndSupervisor[1].tokens, finance);
      emailModel.reportingToAndSupervisor[1].response = responseSupervisor;

      // Update the email document based on the response from "finance"
      if (responseSupervisor === 'approved') {
        emailModel.status = 'processing'; // Update the status to "approved"
        await emailModel.save();

        // Send a status notification email to the user
   /*      const userEmail = emailModel.sender;
        const statusMessage = `Your request has been approved by the ${finance_name}.`;
        await sendStatusNotificationEmail(userEmail, finance_name, statusMessage); */

        // Additional workflow for approved requests, e.g., sending an email to higher_authority
        await sendEmailToApprovers(higher_authority, higher_authority_name, username, productName, emailModel.PR_no, expectedDate, currentDate, quantity, approxCost);
        await emailModel.save();
      } else if (responseSupervisor === 'rejected') {
        emailModel.status = 'rejected'; // Update the status to "rejected"
        await emailModel.save();

        // Send a status notification email to the user
/*         const userEmail = emailModel.sender;
        const statusMessage = `Your request has been rejected by the ${finance_name}.`;
        await sendStatusNotificationEmail(userEmail, finance_name, statusMessage); */
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








/* import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import Routers from './Routes/Routes.js';
import EmailModel from './Models/EmailModelSchema.js';
import { sendStatusNotificationEmail } from './Controllers/EmailToUser.js';
// Set up session middleware in your Express app

const app = express();

mongoose.set('strictQuery', false);
dotenv.config();
app.use(cors());
app.use('/attachment', express.static('attachment'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const PORT = process.env.PORT || 4000;

const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
const MONGODB_URI = process.env.MONGODB_URI || `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@pr-tool.mqmtj3a.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true, useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((error) => {
    console.error('Error connecting to the database', error);
  });


app.use("/", Routers);


app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});




app.post('/action', async (req, res) => {
  try {
    const { action, token, comment } = req.body;
    console.log(req.body);
    if (action) {
      const email = await EmailModel.findOne({ $or: [{ 'reportingToAndSupervisor.tokens.approve': token }, { 'reportingToAndSupervisor.tokens.reject': token }] });

      if (email) {
        if (email.status === 'pending for approval') {
          if (action === 'approved') {
            // If the status is "pending for approval" and action is "approved," update to "processing"
            email.status = 'in process';
            email.To.push(email.reportingToAndSupervisor[1].sendTo);
            email.reportingToAndSupervisor[0].Comment = comment;
            const userEmail = email.sender;
            const statusMessage = `Your request has been approved by the ${email.reportingToAndSupervisor[0].sendToName}.`;
            await sendStatusNotificationEmail(userEmail, email.reportingToAndSupervisor[0].sendToName, statusMessage);
            await sendEmailToApprovers(email.reportingToAndSupervisor[1].sendTo, email.reportingToAndSupervisor[1].sendToName, email.senderName, email.body.productName, email.PR_no, email.body.expectedDate, email.body.currentDate, email.body.quantity, email.body.approxCost);
          }
          // Otherwise, if the status is "pending for approval" and action is "rejected," update to "rejected"
          else if (action === 'rejected') {
            email.status = 'rejected';
            email.reportingToAndSupervisor[0].Comment = comment;
            const userEmail = email.sender;
            const statusMessage = `Your request has been rejected by the ${email.reportingToAndSupervisor[0].sendToName}.`;
            await sendStatusNotificationEmail(userEmail, email.reportingToAndSupervisor[0].sendToName, statusMessage);
          }
          
          email.reportingToAndSupervisor[0].response = action;
          await email.save();
          res.send(`Email ${action} successfully`);
        }

        else if (email.status === 'in process') {
          // If the status is "processing" and action is "approved," update to "approved"
          if (action === 'approved') {
            email.status = 'processing';
            email.To.push(email.reportingToAndSupervisor[2].sendTo);
            const userEmail = email.sender;
            const statusMessage = `Your request has been approved by the ${email.reportingToAndSupervisor[1].sendToName}.`;
            await sendStatusNotificationEmail(userEmail, email.reportingToAndSupervisor[1].sendToName, statusMessage);
            email.reportingToAndSupervisor[1].Comment = comment;
            await sendEmailToApprovers(email.reportingToAndSupervisor[2].sendTo, email.reportingToAndSupervisor[2].sendToName, email.senderName, email.body.productName, email.PR_no, email.body.expectedDate, email.body.currentDate, email.body.quantity, email.body.approxCost);
          }
          else {
            email.status = 'rejected';
            email.reportingToAndSupervisor[1].Comment = comment;
            const userEmail = email.sender;
            const statusMessage = `Your request has been rejected by the ${email.reportingToAndSupervisor[1].sendToName}.`;
            await sendStatusNotificationEmail(userEmail, email.reportingToAndSupervisor[1].sendToName, statusMessage);
          }
          email.reportingToAndSupervisor[1].response = action;
          console.log(email.status);
          await email.save();
          res.send(`Email ${action} `);
        }

        else if (email.status === 'processing') {
          // If the status is "processing" and action is "approved," update to "approved"
          if (action === 'approved') {
            email.status = 'Ready For Purchase';
            email.To.push(email.reportingToAndSupervisor[2].sendTo);

            email.reportingToAndSupervisor[2].Comment = comment;
            await email.save();
            const userEmail = email.sender;
            const statusMessage = `Your request is Ready For Purchase ${email.reportingToAndSupervisor[2].sendToName}`;
            await sendStatusNotificationEmail(userEmail, email.reportingToAndSupervisor[2].sendToName, statusMessage);
          }

          else if (action === 'rejected') {
            email.status = 'rejected';
            email.reportingToAndSupervisor[2].Comment = comment;
            const userEmail = email.sender;
            const statusMessage = `Your request has been rejected ${email.reportingToAndSupervisor[2].sendToName}`;
            await sendStatusNotificationEmail(userEmail, email.reportingToAndSupervisor[2].sendToName, statusMessage);
          }
          email.reportingToAndSupervisor[2].response = action;

          console.log(email.status);
          await email.save();

          res.send(`Email ${action}`);
        }
        else {
          res.status(400).send('Email has already been responded.');
        }
      } else {
        res.status(404).send('Email not found');
      }
    } else {
      res.status(400).send('Invalid action');
    }
  } catch (error) {
    res.status(500).send('Internal server error');
  }
});

 */
