import AWS from 'aws-sdk';

const AWS_Config = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-east-2',
};
const ses = new AWS.SES(AWS_Config);


const SendEmailPRCreationUser = async (usermail,username,currentDate,approxCost,productName,PR_no,reportingTo,finance,higher_authority,expectedDate,quantity,unitPrice) => {
    console.log('userdata',usermail,username,currentDate,approxCost,productName,PR_no,reportingTo,finance,higher_authority);

    try {
        const emailBody = `
            <p>Dear ${username},</p> 
            <p>We are pleased to inform you that your Purchase Requisition (PR) has been successfully created in the system. Please find the details of your PR below: </p>
            PR Details:<br/>
            PR Number: ${PR_no}<br/>
            Requestor: ${username}<br/>
            Date of Request: ${expectedDate}<br/>
             Product Name: ${productName}<br/>
             Quantity: ${quantity}<br/>
             Unit Price:${unitPrice}<br/>
             Total: ${approxCost}</p>
            <br/>
            Next Steps:<br/>
            Your PR will now go through the approval workflow as per the standard process:
            <br/>
            Level 1 Approval:The first level of approval will be reviewed by ${reportingTo}.<br/>
            Level 2 Approval:After Level 1 approval, the PR will be forwarded to ${finance}.<br/>
            Level 3 Approval:Following Level 2 approval, it will proceed to ${higher_authority} for the final approval.<br/>
            
            <p>You will receive notifications at each step of the approval process. You can also track the status of your PR by logging into the Purchase Requisition System and navigating to <a href='https://pr-po-portal-itradiant-a2c0ggbhatd8cwhv.centralindia-01.azurewebsites.net'>"My Requisitions."</a> </p>`;

        const mailOptions = {
            Source: 'Marketing@itradiant1.com',
            Destination: {
                ToAddresses: [usermail],
            },
            Message: {
                Subject: {
                    Data: `Purchase Requisition ${PR_no} Created Successfully`,
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
        console.error('Error while sending email:', error);
    }
};

export default SendEmailPRCreationUser;
