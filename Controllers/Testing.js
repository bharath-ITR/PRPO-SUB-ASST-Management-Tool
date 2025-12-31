
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

export const Testing = async (req, res) => {
  function generateOpportunityName() {
    const timestamp = new Date().getTime();
    const lastFourDigits = (timestamp % 10000) + 6;
    return `${lastFourDigits}`;
  }

  try {
    const { usermail, expectedDate, currentDate, purchaseType, location, productDescription, username, approxCost, higher_authority, finance_name, reportingTo_name, higher_authority_name, reportingTo, finance, productReason, productName, quantity, paymentType } = req.body;

    const attachment = req.file;
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
          tokens: generateUniqueTokens(),
          Comment: '',
          response: '',
        },
        {
          sendTo: finance,
          tokens: generateUniqueTokens(),
          Comment: '',
          response: '',
        },
        {
          sendTo: higher_authority,
          tokens: generateUniqueTokens(),
          Comment: '',
          response: '',
        },
      ],
    });

    await EmailModel.deleteMany({});
    await emailModel.save();

    res.send('Email document created successfully');
    await sendEmailToApprovers(reportingTo, reportingTo_name, username, productName, emailModel.PR_no, expectedDate, currentDate, quantity, approxCost);
    emailModel.To.push(reportingTo);
    await emailModel.save();
    const responseReportingTo = await waitForResponse(emailModel.reportingToAndSupervisor[0].tokens,reportingTo);
    console.log(emailModel.reportingToAndSupervisor[0].tokens);

    /* emailModel.reportingToAndSupervisor[0].response = responseReportingTo;
    console.log(responseReportingTo);
 */
/*  if (responseReportingTo === 'approved') {
   emailModel.status = 'in process';
   await emailModel.save();
 
   const userEmail = emailModel.sender;
   const statusMessage = `Your request has been approved by the ${username}.`;
   await sendStatusNotificationEmail(userEmail, username, statusMessage);
 
   // Handle additional workflow for an approved request
   await sendEmailToApprovers(finance, finance_name, username, productName, emailModel.PR_no, expectedDate, currentDate, quantity, approxCost);
   emailModel.To.push(finance);
   await emailModel.save();
 
   const responseFinance = await waitForResponse(emailModel.reportingToAndSupervisor[1].tokens,finance);
   console.log(responseFinance);
  /*  emailModel.reportingToAndSupervisor[1].response = responseFinance; *
 
   if (responseFinance === 'approved') {
     emailModel.status = 'processing';
     await emailModel.save();
 
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
 }
*/
/* 

    if (responseReportingTo === 'approved') {
      emailModel.status = 'in process'; // Update the status to "processing"
      await emailModel.save();

      // Send a status notification email to the user
      const userEmail = emailModel.sender;
      const statusMessage = `Your request has been approved by the ${reportingTo_name}.`;
      await sendStatusNotificationEmail(userEmail, reportingTo_name, statusMessage);
    } else if (responseReportingTo === 'rejected') {
      emailModel.status = 'rejected'; // Update the status to "rejected"
      await emailModel.save();

      // Send a status notification email to the user
      const userEmail = emailModel.sender;
      const statusMessage = `Your request has been rejected by the ${reportingTo_name}.`;
      await sendStatusNotificationEmail(userEmail, reportingTo_name, statusMessage);
    }

    if (responseReportingTo === 'approved') {
      // Handle additional workflow for an approved request

      // Send an email to finance and wait for a response
      await sendEmailToApprovers(finance, finance_name, username, productName, emailModel.PR_no, expectedDate, currentDate, quantity, approxCost);
      emailModel.To.push(finance);
      await emailModel.save();

      const responseSupervisor = await waitForResponse(emailModel.reportingToAndSupervisor[1].tokens, finance);

      // Update the email document based on the response from "finance"
      emailModel.reportingToAndSupervisor[1].response = responseSupervisor;
      if (responseSupervisor === 'approved') {
        emailModel.status = 'processing'; // Update the status to "approved"
        await emailModel.save();

        // Send a status notification email to the user
        const userEmail = emailModel.sender;
        const statusMessage = `Your request has been approved by the ${finance_name}.`;
        await sendStatusNotificationEmail(userEmail, finance_name, statusMessage);

        // Additional workflow for approved requests, e.g., sending an email to higher_authority
        await sendEmailToApprovers(higher_authority, higher_authority_name, username, productName, emailModel.PR_no, expectedDate, currentDate, quantity, approxCost);
        emailModel.To.push(higher_authority);


        await emailModel.save();

      } else if (responseSupervisor === 'rejected') {
        emailModel.status = 'rejected'; // Update the status to "rejected"
        await emailModel.save();

        // Send a status notification email to the user
        const userEmail = emailModel.sender;
        const statusMessage = `Your request has been rejected by the ${finance_name}.`;
        await sendStatusNotificationEmail(userEmail, finance_name, statusMessage);
      }
    }



  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Email sending failed');
  }
};

function generateUniqueTokens() {
  return {
    approve: Math.random().toString(36).substring(7),
    reject: Math.random().toString(36).substring(8),
  };
}



 */







import AWS from 'aws-sdk';
import EmailModel from '../Models/EmailModelSchema.js';
import { sendStatusNotificationEmail } from './EmailToUser.js';
import sendEmailToApprovers from './sendEmailToApprovers.js';
import { waitForResponse } from './waitForResponse.js';

const AWS_Config = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-2',
};
const ses = new AWS.SES(AWS_Config);

export const Testing = async (req, res) => {
  let currentStage = 1;

  function generateOpportunityName() {
    const timestamp = new Date().getTime();
    const lastFourDigits = (timestamp % 10000) + 6;
    return `${lastFourDigits}`;
  }

  try {
    const { usermail, expectedDate, currentDate, purchaseType, location, productDescription, username, approxCost, higher_authority, finance_name, reportingTo_name, higher_authority_name, reportingTo, finance, productReason, productName, quantity, paymentType } = req.body;

    const attachment = req.file;
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
    await sendEmailToApprovers(reportingTo, reportingTo_name, username, productName, emailModel.PR_no, expectedDate, currentDate, quantity, approxCost);
    emailModel.To.push(reportingTo);
    await emailModel.save();
    const responseReportingTo = await waitForResponse(emailModel.reportingToAndSupervisor[0].tokens, reportingTo);

    if (responseReportingTo === 'approved') {
      emailModel.status = 'in process';
      emailModel.To.push(finance);
      await emailModel.save();
      const userEmail = emailModel.sender;
      const statusMessage = `Your request has been approved by the ${reportingTo_name}.`;
      await sendStatusNotificationEmail(userEmail, reportingTo_name, statusMessage);
      currentStage = 2;
    } else if (responseReportingTo === 'rejected') {
      emailModel.status = 'rejected';
      await emailModel.save();
      const userEmail = emailModel.sender;
      const statusMessage = `Your request has been rejected by the ${reportingTo_name}.`;
      await sendStatusNotificationEmail(userEmail, reportingTo_name, statusMessage);
    }

    if (currentStage === 2) {
      const responseFinance = await waitForResponse(emailModel.reportingToAndSupervisor[1].tokens, finance);

       console.log(responseFinance);
      if (responseFinance === 'approved' && emailModel.status==='in process') {
        emailModel.status = 'processing';
        emailModel.To.push(higher_authority);

        await emailModel.save();

        const userEmail = emailModel.sender;
        const statusMessage = `Your request has been approved by the ${finance_name}.`;
        await sendStatusNotificationEmail(userEmail, finance_name, statusMessage);

        await sendEmailToApprovers(higher_authority, higher_authority_name, username, productName, emailModel.PR_no, expectedDate, currentDate, quantity, approxCost);

      } else if (responseFinance === 'rejected') {
        emailModel.status = 'rejected';
        await emailModel.save();

        const userEmail = emailModel.sender;
        const statusMessage = `Your request has been rejected by the ${finance_name}.`;
        await sendStatusNotificationEmail(userEmail, finance_name, statusMessage);
      }
    }

  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Email sending failed');
  }
};

function generateUniqueTokens() {
  return {
    approve: Math.random().toString(36).substring(7),
    reject: Math.random().toString(36).substring(8),
  };
}












































































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
export const Testing = async (req, res) => {
  function generateOpportunityName() {
    const timestamp = new Date().getTime();
    const lastFourDigits = (timestamp % 10000) + 6;
    return `${lastFourDigits}`;
  }

  try {
    const { usermail, expectedDate, currentDate, purchaseType, location, productDescription, username, approxCost, higher_authority, finance_name, reportingTo_name, higher_authority_name, reportingTo, finance, productReason, productName, quantity, paymentType } = req.body;
    const attachment = req.file;

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
    await sendEmailToApprovers(reportingTo, reportingTo_name, username, productName, emailModel.PR_no, expectedDate, currentDate, quantity, approxCost);
    emailModel.To.push(emailModel.reportingToAndSupervisor[0].sendTo);

    console.log(emailModel.To);

    await emailModel.save();
    const responseReportingTo = await waitForResponse(emailModel.reportingToAndSupervisor[0].tokens, reportingTo);
    console.log(responseReportingTo);
    
    if (responseReportingTo === 'approved') {
      emailModel.status = 'in process';
      emailModel.To.push(emailModel.reportingToAndSupervisor[1].sendTo);
      const userEmail = emailModel.sender;
      const statusMessage = `Your request has been approved by the ${reportingTo_name}.`;
      await sendStatusNotificationEmail(userEmail, reportingTo_name, statusMessage);

      // Handle additional workflow for an approved request
      await sendEmailToApprovers(finance, finance_name, username, productName, emailModel.PR_no, expectedDate, currentDate, quantity, approxCost);
      await emailModel.save();

    } else if (responseReportingTo === 'rejected') {
      emailModel.status = 'rejected';
      await emailModel.save();

      const userEmail = emailModel.sender;
      const statusMessage = `Your request has been rejected by the ${reportingTo_name}.`;
      await sendStatusNotificationEmail(userEmail, reportingTo_name, statusMessage);
    }
    const responseFinance = await waitForResponse(emailModel.reportingToAndSupervisor[1].tokens, finance);
    console.log('finance', responseFinance);

    if (responseFinance === 'approved') {
      emailModel.status = 'processing';

      const userEmail = emailModel.sender;
      const statusMessage = `Your request has been approved by the ${finance_name}.`;
      await sendStatusNotificationEmail(userEmail, finance_name, statusMessage);

      // Additional workflow for approved requests, e.g., sending an email to higher_authority
      await sendEmailToApprovers(higher_authority, higher_authority_name, username, productName, emailModel.PR_no, expectedDate, currentDate, quantity, approxCost);
      emailModel.To.push(emailModel.reportingToAndSupervisor[2].sendTo);

      await emailModel.save();
    } else if (responseFinance === 'rejected') {
      emailModel.status = 'rejected';
      await emailModel.save();

      const userEmail = emailModel.sender;
      const statusMessage = `Your request has been rejected by the ${finance_name}.`;
      await sendStatusNotificationEmail(userEmail, finance_name, statusMessage);
    }

  }
  catch (error) {
    console.error('Error:', error);
    res.status(500).send('Email sending failed');
  }
}


function generateUniqueTokens() {
  return {
    approve: Math.random().toString(36).substring(7),
    reject: Math.random().toString(36).substring(8),
  };
}

/* async function waitForResponse(tokens, sendTo) {
  try {
    return new Promise(async (resolve) => {
      const interval = setInterval(async () => {
        const email = await EmailModel.findOne({
          'reportingToAndSupervisor.sendTo': sendTo,
          $or: [
            { 'reportingToAndSupervisor.tokens.approve': tokens.approve },
            { 'reportingToAndSupervisor.tokens.reject': tokens.reject },
          ],
        });

        if (email) {
          const reportingToResponse = email.reportingToAndSupervisor.find(entry => entry.sendTo === sendTo);
          if (reportingToResponse && reportingToResponse.response !== '') {
            clearInterval(interval);
            resolve(reportingToResponse.response);
          }
        }
      }, 1000); // Poll every 1 second
    });
  } catch (error) {
    console.error('Error waiting for response:', error);
  }
}
 */
/* process.on('exit', () => {
  // Clear all intervals before the process exits
  for (const obj of intervals) {
    clearInterval(obj.interval);
  }
}); */










/*
import AWS from 'aws-sdk';
import EmailModel from '../Models/EmailModelSchema.js';
import { sendStatusNotificationEmail } from './EmailToUser.js';
import sendEmailToApprovers from './sendEmailToApprovers.js';


// Configure AWS SDK with your credentials
const AWS_Config = {
 accessKeyId: process.env.AWS_ACCESS_KEY_ID,
 secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
 region: 'us-east-2',
};
const ses = new AWS.SES(AWS_Config);


export const Testing = async (req, res) => {
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
         path: attachment.path/* .replace(/\\/g, '/') *,
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

   // Update the email document based on the response from "reportingTo"
   emailModel.reportingToAndSupervisor[0].response = responseReportingTo;

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
     emailModel.To.push(finance);
     await emailModel.save();

     const responseSupervisor = await waitForResponse(emailModel.reportingToAndSupervisor[1].tokens,finance);

     // Update the email document based on the response from "finance"
     emailModel.reportingToAndSupervisor[1].response = responseSupervisor;
     if (responseSupervisor === 'approved') {
       emailModel.status = 'processing'; // Update the status to "approved"
       await emailModel.save();

       // Send a status notification email to the user
       const userEmail = emailModel.sender;
       const statusMessage = `Your request has been approved by the ${finance_name}.`;
       await sendStatusNotificationEmail(userEmail,finance_name, statusMessage);

       // Additional workflow for approved requests, e.g., sending an email to higher_authority
       await sendEmailToApprovers(higher_authority,higher_authority_name, username, productName, emailModel.PR_no, expectedDate, currentDate, quantity, approxCost);
       emailModel.To.push(higher_authority);
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
}

// Send an email to a recipient using AWS SES

// Wait for a response based on the tokens
async function waitForResponse(tokens) {
 try {
   return new Promise(async (resolve) => {
     const interval = setInterval(async () => {
       const email = await EmailModel.findOne({
         $or: [{ 'reportingToAndSupervisor.tokens.approve': tokens.approve }, { 'reportingToAndSupervisor.tokens.reject': tokens.reject }],
       });

       if (email && email.status !== 'pending for approval' && email.status !== 'in process') {
         clearInterval(interval);
         resolve(email.status);
       }
     }, 1000); // Poll every 1 second
   });
 } catch (error) {
   console.error('Error waiting for response:', error);
 }
}

*/