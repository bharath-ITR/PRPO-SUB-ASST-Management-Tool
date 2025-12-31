/* import AWS from 'aws-sdk';

const AWS_Config = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-east-2',
};
const ses = new AWS.SES(AWS_Config);


const sendEmailToApprovers = async (recipient, recipient_name, username, productName, PR_no, expectedDate, currentDate, quantity, approxCost) => {
    console.log(recipient, recipient_name, username, productName, PR_no, expectedDate, currentDate, quantity, approxCost);

    try {
        const emailBody = `
            <p>Dear ${recipient_name},</p> 
            <p>Purchase requisition that has been submitted and requires your attention. The details of the requisition are as follows: </p>
            <p>Requisition Number: ${PR_no}</p>
            <p>Requester's Name: ${username}</p>
            <p>Expected Date: ${expectedDate}</p>
            <p>Item Details:<br/> 
                Item Name: ${productName}<br/>
                Quantity: ${quantity}<br/>
                Unit Price: ${approxCost}</p>
            <br/>
            <p>Please review the requisition and provide your approval or any necessary feedback by the deadline date. You can access the complete requisition form and supporting documents by logging into our procurement system 'Purchase Requisition' using your credentials.</p>
            <br/>
            ${username}`;

        const mailOptions = {
            Source: 'Marketing@itradiant1.com',
            Destination: {
                ToAddresses: [recipient],
            },
            Message: {
                Subject: {
                    Data: `Purchase Requisition Notification - ${PR_no}`,
                },
                Body: {
                    Html: {
                        Data: emailBody,
                    },
                },
                // Include the attachment
             /*    Attachments: attachment ? [
                    {
                        Name: attachment.originalname,
                        Content: attachment.buffer.toString('base64'),
                        ContentType: attachment.mimetype,
                    },
                ] : [], *
            },
        };

        // Send the email using AWS SES
        await ses.sendEmail(mailOptions).promise();
    } catch (error) {
        console.error('Error while sending email:', error);
    }
};

export default sendEmailToApprovers;
 */

import AWS from "aws-sdk";

const AWS_Config = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "us-east-2",
};
const ses = new AWS.SES(AWS_Config);

const sendEmailToApprovers = async (
  recipient,
  recipient_name,
  username,
  productName,
  PR_no,
  expectedDate,
  currentDate,
  quantity,
  unitPrice,
  approxCost
) => {
  console.log(
    recipient,
    recipient_name,
    username,
    productName,
    PR_no,
    expectedDate,
    currentDate,
    quantity,
    approxCost
  );

  try {
    const emailBody = `
            <p>Dear ${recipient_name},</p> 
            <p>We would like to inform you that a new Purchase Requisition (PR) has been created and requires your attention. Below are the details of the PR: </p>
            PR Details:<br/>
           PR Number: ${PR_no}<br/>
           Requestor: ${username}<br/>
           Date of Request: ${currentDate}<br/>
                Product Name: ${productName}<br/>
                Quantity: ${quantity}<br/>
                Unit Price :${unitPrice}<br/>
                Total: ${approxCost}
            <br/>
            <br/>
            Current Status:<br/>
            The PR is currently pending with ${recipient_name}.

<a href='https://pr-po-portal-itradiant-a2c0ggbhatd8cwhv.centralindia-01.azurewebsites.net/history'>Give Response</a>
            <br/>
            <p>Report a issue:support@itradiant.com</p>`;

    const mailOptions = {
      Source: "Marketing@itradiant1.com",
      Destination: {
        ToAddresses: [recipient],
      },
      Message: {
        Subject: {
          Data: `Purchase Requisition ${PR_no} - Action Required`,
        },
        Body: {
          Html: {
            Data: emailBody,
          },
        },
        // Include the attachment
        /*    Attachments: attachment ? [
                       {
                           Name: attachment.originalname,
                           Content: attachment.buffer.toString('base64'),
                           ContentType: attachment.mimetype,
                       },
                   ] : [], */
      },
    };

    // Send the email using AWS SES
    await ses.sendEmail(mailOptions).promise();
  } catch (error) {
    console.error("Error while sending email:", error);
  }
};

export default sendEmailToApprovers;
