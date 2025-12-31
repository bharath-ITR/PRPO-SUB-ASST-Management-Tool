import AWS from 'aws-sdk';

const AWS_Config = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-2',
};
const ses = new AWS.SES(AWS_Config);


export const sendStatusNotificationEmail = async (usermail, approvedBy_email, approvedBy_name, username, productName, PR_no, expectedDate, currentDate, quantity, approxCost, unitPrice, comment) => {
  console.log('userdata', approvedBy_email, approvedBy_name, username, productName, PR_no, expectedDate, currentDate, quantity, approxCost, unitPrice, comment);

  try {
    const emailBody = `
            <p>Dear ${username},</p> 
            <p>We are pleased to inform you that your Purchase Requisition (PR) has been approved successfully. Below are the details of your PR:<br/>

            PR Details:<br/>
            PR Number: ${PR_no}<br/>
            Date of Request: ${currentDate}<br/>
             Product Name: ${productName}<br/>
             Quantity: ${quantity}<br/>
             Unit Price:${unitPrice}<br/>
             Total: ${approxCost}</p>
            <br/>
            Approval Summary:<br/>
            Approved By: ${approvedBy_name}<br/>
            Comments : ${comment}`;

    const mailOptions = {
      Source: 'Marketing@itradiant1.com',
      Destination: {
        ToAddresses: [usermail],
      },
      Message: {
        Subject: {
          Data: `Purchase Requisition ${PR_no} Approved`,
        },
        Body: {
          Html: {
            Data: emailBody,
          },
        },
       
      },
    };

    // Send the email using AWS SES
    await ses.sendEmail(mailOptions).promise();
  } catch (error) {
    console.error('Error while sending email:', error);
  }
};

export default sendStatusNotificationEmail;











