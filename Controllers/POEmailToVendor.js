import AWS from "aws-sdk";
import nodemailer from "nodemailer";

const AWS_Config = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "us-east-2",
};

const ses = new AWS.SES(AWS_Config);

export const POEmailToVendor = async (vendorEmail, PONumber, filePath) => {
  try {
    if (!vendorEmail || !PONumber) {
      throw new Error("Missing required fields: 'vendorEmail' and 'PONumber' are required.");
    }

    const transporter = nodemailer.createTransport({
      SES: { ses, aws: AWS },
    });

    const mailOptions = {
      from: "Marketing@itradiant1.com",
      to: vendorEmail,
      subject: `Purchase Order: ${PONumber}`,
      text: `Please find attached the Purchase Order: ${PONumber}`,
      attachments: filePath
        ? [
            {
              filename: `${PONumber}.pdf`,
              path: filePath,
            },
          ]
        : [],
    };

    await transporter.sendMail(mailOptions);

    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};
