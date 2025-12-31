// import express from 'express';
// import dotenv from 'dotenv';
// import bodyParser from 'body-parser';
// import cors from 'cors';
// import Routers from './Routes/Routes.js';
// import EmailModel from './Models/EmailModelSchema.js';
// import { sendStatusNotificationEmail } from './Controllers/EmailToUser.js';
// import Database from './Database.js';
// import sendEmailToApprovers from './Controllers/sendEmailToApprovers.js';
// import path from 'path';
// import RejectEmailToUser from './Controllers/RejectEmailToUser.js';

// const app = express();
// dotenv.config();
// app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// const PORT = process.env.PORT || 8080;

// const __dirname = path.resolve();
// app.use(express.static(path.join(__dirname, 'client/build')));

// app.use((req, res, next) => {
//   console.log(`Request URL: ${req.url}`);
//   next();
// });

// app.use("/", Routers);
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Something broke!');
// });

// app.post('/action', async (req, res) => {
//   try {
//     const { action, token, comment } = req.body;
//     console.log(req.body);
//     if (action) {
//       const email = await EmailModel.findOne({ $or: [{ 'reportingToAndSupervisor.tokens.approve': token }, { 'reportingToAndSupervisor.tokens.reject': token }] });

//       if (email) {
//         console.log('data',)
//         if (email.status === 'pending for approval' ) {
//           if (action === 'approved') {
//             // If the status is "pending for approval" and action is "approved," update to "processing"
//             email.status = 'in process';
//             email.To.push(email.reportingToAndSupervisor[1].sendTo);
//             email.reportingToAndSupervisor[0].Comment = comment;
//             const userEmail = email.sender;

//             await sendStatusNotificationEmail(userEmail,email.reportingToAndSupervisor[0].sendTo, email.reportingToAndSupervisor[0].sendToName, email.senderName, email.body.productName, email.PR_no, email.body.expectedDate, email.body.currentDate, email.body.quantity, email.body.approxCost,email.body.unitPrice,comment);
//             await sendEmailToApprovers(email.reportingToAndSupervisor[1].sendTo, email.reportingToAndSupervisor[1].sendToName, email.senderName, email.body.productName, email.PR_no, email.body.expectedDate, email.body.currentDate, email.body.quantity, email.body.approxCost,email.body.unitPrice);
//           }
//           // Otherwise, if the status is "pending for approval" and action is "rejected," update to "rejected"
//           else if (action === 'rejected') {
//             email.status = 'rejected';
//             email.reportingToAndSupervisor[0].Comment = comment;
//             const userEmail = email.sender;

//             await RejectEmailToUser(userEmail,email.reportingToAndSupervisor[0].sendTo, email.reportingToAndSupervisor[0].sendToName, email.senderName, email.body.productName, email.PR_no, email.body.expectedDate, email.body.currentDate, email.body.quantity, email.body.approxCost,email.body.unitPrice,comment);
//           }

//           email.reportingToAndSupervisor[0].response = action;
//           await email.save();
//           res.send(`Email ${action} successfully`);
//         }

//         else if (email.status === 'in process') {
//           // If the status is "processing" and action is "approved," update to "approved"
//           if (action === 'approved' ) {
//             email.status = 'processing';
//             email.To.push(email.reportingToAndSupervisor[2].sendTo);
//             const userEmail = email.sender;
//             email.reportingToAndSupervisor[1].Comment = comment;

//             await sendStatusNotificationEmail(userEmail,email.reportingToAndSupervisor[1].sendTo, email.reportingToAndSupervisor[1].sendToName, email.senderName, email.body.productName, email.PR_no, email.body.expectedDate, email.body.currentDate, email.body.quantity, email.body.approxCost,email.body.unitPrice,comment);
//             await sendEmailToApprovers(email.reportingToAndSupervisor[2].sendTo, email.reportingToAndSupervisor[2].sendToName, email.senderName, email.body.productName, email.PR_no, email.body.expectedDate, email.body.currentDate, email.body.quantity, email.body.approxCost,email.body.unitPrice);
//           }
//           else {
//             email.status = 'rejected';
//             email.reportingToAndSupervisor[1].Comment = comment;
//             const userEmail = email.sender;

//             await RejectEmailToUser(userEmail,email.reportingToAndSupervisor[1].sendTo, email.reportingToAndSupervisor[1].sendToName, email.senderName, email.body.productName, email.PR_no, email.body.expectedDate, email.body.currentDate, email.body.quantity, email.body.approxCost,email.body.unitPrice,comment);
//           }
//           email.reportingToAndSupervisor[1].response = action;
//           console.log(email.status);
//           await email.save();
//           res.send(`Email approved successfully`);
//         }

//         else if (email.status === 'processing') {
//           // If the status is "processing" and action is "approved," update to "approved"
//           if (action === 'approved') {
//             email.status = 'Ready For Purchase';
//             email.reportingToAndSupervisor[2].Comment = comment;
//             await email.save();
//             const userEmail = email.sender;

//             await sendStatusNotificationEmail(userEmail,email.reportingToAndSupervisor[2].sendTo, email.reportingToAndSupervisor[2].sendToName, email.senderName, email.body.productName, email.PR_no, email.body.expectedDate, email.body.currentDate, email.body.quantity, email.body.approxCost,email.body.unitPrice,comment);
//           }

//           else if (action === 'rejected') {
//             email.status = 'rejected';
//             email.reportingToAndSupervisor[2].Comment = comment;
//             const userEmail = email.sender;

//             await RejectEmailToUser(userEmail,email.reportingToAndSupervisor[2].sendTo, email.reportingToAndSupervisor[2].sendToName, email.senderName, email.body.productName, email.PR_no, email.body.expectedDate, email.body.currentDate, email.body.quantity, email.body.approxCost,email.body.unitPrice,comment);
//           }
//           email.reportingToAndSupervisor[2].response = action;

//           console.log(email.status);
//           await email.save();

//           res.send(`Email approved successfully`);
//         }
//         else {
//           res.status(400).send('Email has already been responded.');
//         }
//       } else {
//         res.status(404).send('Email not found');
//       }
//     } else {
//       res.status(400).send('Invalid action');
//     }
//   } catch (error) {
//     res.status(500).send('Internal server error');
//   }
// });

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
// });
// app.listen(PORT, () => {
//   console.log(`Server listening on port ${PORT}`);
// });

// Database();

import express from "express";
import dotenv from "dotenv";
// import bodyParser from "body-parser";
import cors from "cors";
import Routers from "./Routes/Routes.js";
import EmailModel from "./Models/EmailModelSchema.js";
import { sendStatusNotificationEmail } from "./Controllers/EmailToUser.js";
import Database from "./Database.js";
import sendEmailToApprovers from "./Controllers/sendEmailToApprovers.js";
import path from "path";
import RejectEmailToUser from "./Controllers/RejectEmailToUser.js";
// Subscriptions Routes
import subscriptionRoutes from "./SubscriptionsRoutes/subscription.routes.js";
import assetRoutes from "./SubscriptionsRoutes/asset.routes.js";
import { errorHandler } from "./SubscriptionsMiddlewares/error.middleware.js";

const app = express();
dotenv.config();
app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT;
dotenv.config(); // load envs

// ------------------- Minimal Azure-safety additions -------------------
// Basic Azure startup logging
console.log("========================= Starting server.js ============================");
console.log("Node Version:", process.version);
console.log("PORT (env):", PORT);
console.log(
  "MONGODB_URI:",
  process.env.MONGODB_URI ? "set ✅" : "not set ❌"
);

// Stop immediately if essential env vars are missing
if (!process.env.MONGODB_URI) {
  console.error("Error: MONGODB_URI is missing! Stopping server.");
  process.exit(1);
}

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "client/build")));

app.use((req, res, next) => {
  console.log(`Request URL: ${req.url}`);
  next();
});

app.use("/", Routers);

// Subscriptions Routes
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/assets", assetRoutes);
app.use("/uploads", express.static("uploads"));

app.use("/test", (req, res) => {
  res.status(200).send("Hello World");
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("[Global Error]", err.stack);
  res.status(500).send("Something broke!");
});

app.post("/action", async (req, res) => {
  try {
    const { action, token, comment } = req.body;
    console.log(req.body);

    if (action) {
      const email = await EmailModel.findOne({
        $or: [
          { "reportingToAndSupervisor.tokens.approve": token },
          { "reportingToAndSupervisor.tokens.reject": token },
        ],
      });

      if (email) {
        console.log("data");

        if (email.status === "pending for approval") {
          if (action === "approved") {
            email.status = "in process";
            email.To.push(email.reportingToAndSupervisor[1].sendTo);
            email.reportingToAndSupervisor[0].Comment = comment;
            email.reportingToAndSupervisor[0].response = action;

            // ✅ Update timestamp for first approver
            email.reportingToAndSupervisor[0].updatedAt = new Date();
            email.markModified("reportingToAndSupervisor");

            const userEmail = email.sender;

            await sendStatusNotificationEmail(
              userEmail,
              email.reportingToAndSupervisor[0].sendTo,
              email.reportingToAndSupervisor[0].sendToName,
              email.senderName,
              email.body.productName,
              email.PR_no,
              email.body.expectedDate,
              email.body.currentDate,
              email.body.quantity,
              email.body.approxCost,
              email.body.unitPrice,
              comment
            );
            await sendEmailToApprovers(
              email.reportingToAndSupervisor[1].sendTo,
              email.reportingToAndSupervisor[1].sendToName,
              email.senderName,
              email.body.productName,
              email.PR_no,
              email.body.expectedDate,
              email.body.currentDate,
              email.body.quantity,
              email.body.approxCost,
              email.body.unitPrice
            );
          } else if (action === "rejected") {
            email.status = "rejected";
            email.reportingToAndSupervisor[0].Comment = comment;
            email.reportingToAndSupervisor[0].response = action;

            // ✅ Update timestamp for first approver
            email.reportingToAndSupervisor[0].updatedAt = new Date();
            email.markModified("reportingToAndSupervisor");

            const userEmail = email.sender;

            await RejectEmailToUser(
              userEmail,
              email.reportingToAndSupervisor[0].sendTo,
              email.reportingToAndSupervisor[0].sendToName,
              email.senderName,
              email.body.productName,
              email.PR_no,
              email.body.expectedDate,
              email.body.currentDate,
              email.body.quantity,
              email.body.approxCost,
              email.body.unitPrice,
              comment
            );
          }

          await email.save();
          res.send(`Email ${action} successfully`);
        } else if (email.status === "in process") {
          if (action === "approved") {
            email.status = "processing";
            email.To.push(email.reportingToAndSupervisor[2].sendTo);
            email.reportingToAndSupervisor[1].Comment = comment;
            email.reportingToAndSupervisor[1].response = action;

            // ✅ Update timestamp for second approver
            email.reportingToAndSupervisor[1].updatedAt = new Date();
            email.markModified("reportingToAndSupervisor");

            const userEmail = email.sender;

            await sendStatusNotificationEmail(
              userEmail,
              email.reportingToAndSupervisor[1].sendTo,
              email.reportingToAndSupervisor[1].sendToName,
              email.senderName,
              email.body.productName,
              email.PR_no,
              email.body.expectedDate,
              email.body.currentDate,
              email.body.quantity,
              email.body.approxCost,
              email.body.unitPrice,
              comment
            );
            await sendEmailToApprovers(
              email.reportingToAndSupervisor[2].sendTo,
              email.reportingToAndSupervisor[2].sendToName,
              email.senderName,
              email.body.productName,
              email.PR_no,
              email.body.expectedDate,
              email.body.currentDate,
              email.body.quantity,
              email.body.approxCost,
              email.body.unitPrice
            );
          } else {
            email.status = "rejected";
            email.reportingToAndSupervisor[1].Comment = comment;
            email.reportingToAndSupervisor[1].response = action;

            // ✅ Update timestamp for second approver
            email.reportingToAndSupervisor[1].updatedAt = new Date();
            email.markModified("reportingToAndSupervisor");

            const userEmail = email.sender;

            await RejectEmailToUser(
              userEmail,
              email.reportingToAndSupervisor[1].sendTo,
              email.reportingToAndSupervisor[1].sendToName,
              email.senderName,
              email.body.productName,
              email.PR_no,
              email.body.expectedDate,
              email.body.currentDate,
              email.body.quantity,
              email.body.approxCost,
              email.body.unitPrice,
              comment
            );
          }
          await email.save();
          res.send(`Email approved successfully`);
        } else if (email.status === "processing") {
          if (action === "approved") {
            email.status = "Ready For Purchase";
            email.reportingToAndSupervisor[2].Comment = comment;
            email.reportingToAndSupervisor[2].response = action;

            // ✅ Update timestamp for third approver
            email.reportingToAndSupervisor[2].updatedAt = new Date();
            email.markModified("reportingToAndSupervisor");

            await email.save();

            const userEmail = email.sender;

            await sendStatusNotificationEmail(
              userEmail,
              email.reportingToAndSupervisor[2].sendTo,
              email.reportingToAndSupervisor[2].sendToName,
              email.senderName,
              email.body.productName,
              email.PR_no,
              email.body.expectedDate,
              email.body.currentDate,
              email.body.quantity,
              email.body.approxCost,
              email.body.unitPrice,
              comment
            );
          } else if (action === "rejected") {
            email.status = "rejected";
            email.reportingToAndSupervisor[2].Comment = comment;
            email.reportingToAndSupervisor[2].response = action;

            // ✅ Update timestamp for third approver
            email.reportingToAndSupervisor[2].updatedAt = new Date();
            email.markModified("reportingToAndSupervisor");

            const userEmail = email.sender;

            await RejectEmailToUser(
              userEmail,
              email.reportingToAndSupervisor[2].sendTo,
              email.reportingToAndSupervisor[2].sendToName,
              email.senderName,
              email.body.productName,
              email.PR_no,
              email.body.expectedDate,
              email.body.currentDate,
              email.body.quantity,
              email.body.approxCost,
              email.body.unitPrice,
              comment
            );
          }

          await email.save();
          res.send(`Email approved successfully`);
        } else {
          res.status(400).send("Email has already been responded.");
        }
      } else {
        res.status(404).send("Email not found");
      }
    } else {
      res.status(400).send("Invalid action");
    }
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// app.post("/action", async (req, res) => {
//   try {
//     const { action, token, comment } = req.body;
//     console.log(req.body);
//     if (action) {
//       const email = await EmailModel.findOne({
//         $or: [
//           { "reportingToAndSupervisor.tokens.approve": token },
//           { "reportingToAndSupervisor.tokens.reject": token },
//         ],
//       });

//       if (email) {
//         console.log("data");
//         if (email.status === "pending for approval") {
//           if (action === "approved") {
//             // If the status is "pending for approval" and action is "approved," update to "processing"
//             email.status = "in process";
//             email.To.push(email.reportingToAndSupervisor[1].sendTo);
//             email.reportingToAndSupervisor[0].Comment = comment;
//             const userEmail = email.sender;

//             await sendStatusNotificationEmail(
//               userEmail,
//               email.reportingToAndSupervisor[0].sendTo,
//               email.reportingToAndSupervisor[0].sendToName,
//               email.senderName,
//               email.body.productName,
//               email.PR_no,
//               email.body.expectedDate,
//               email.body.currentDate,
//               email.body.quantity,
//               email.body.approxCost,
//               email.body.unitPrice,
//               comment
//             );
//             await sendEmailToApprovers(
//               email.reportingToAndSupervisor[1].sendTo,
//               email.reportingToAndSupervisor[1].sendToName,
//               email.senderName,
//               email.body.productName,
//               email.PR_no,
//               email.body.expectedDate,
//               email.body.currentDate,
//               email.body.quantity,
//               email.body.approxCost,
//               email.body.unitPrice
//             );
//           }
//           // Otherwise, if the status is "pending for approval" and action is "rejected," update to "rejected"
//           else if (action === "rejected") {
//             email.status = "rejected";
//             email.reportingToAndSupervisor[0].Comment = comment;
//             const userEmail = email.sender;

//             await RejectEmailToUser(
//               userEmail,
//               email.reportingToAndSupervisor[0].sendTo,
//               email.reportingToAndSupervisor[0].sendToName,
//               email.senderName,
//               email.body.productName,
//               email.PR_no,
//               email.body.expectedDate,
//               email.body.currentDate,
//               email.body.quantity,
//               email.body.approxCost,
//               email.body.unitPrice,
//               comment
//             );
//           }

//           email.reportingToAndSupervisor[0].response = action;
//           await email.save();
//           res.send(`Email ${action} successfully`);
//         } else if (email.status === "in process") {
//           // If the status is "processing" and action is "approved," update to "approved"
//           if (action === "approved") {
//             email.status = "processing";
//             email.To.push(email.reportingToAndSupervisor[2].sendTo);
//             const userEmail = email.sender;
//             email.reportingToAndSupervisor[1].Comment = comment;

//             await sendStatusNotificationEmail(
//               userEmail,
//               email.reportingToAndSupervisor[1].sendTo,
//               email.reportingToAndSupervisor[1].sendToName,
//               email.senderName,
//               email.body.productName,
//               email.PR_no,
//               email.body.expectedDate,
//               email.body.currentDate,
//               email.body.quantity,
//               email.body.approxCost,
//               email.body.unitPrice,
//               comment
//             );
//             await sendEmailToApprovers(
//               email.reportingToAndSupervisor[2].sendTo,
//               email.reportingToAndSupervisor[2].sendToName,
//               email.senderName,
//               email.body.productName,
//               email.PR_no,
//               email.body.expectedDate,
//               email.body.currentDate,
//               email.body.quantity,
//               email.body.approxCost,
//               email.body.unitPrice
//             );
//           } else {
//             email.status = "rejected";
//             email.reportingToAndSupervisor[1].Comment = comment;
//             const userEmail = email.sender;

//             await RejectEmailToUser(
//               userEmail,
//               email.reportingToAndSupervisor[1].sendTo,
//               email.reportingToAndSupervisor[1].sendToName,
//               email.senderName,
//               email.body.productName,
//               email.PR_no,
//               email.body.expectedDate,
//               email.body.currentDate,
//               email.body.quantity,
//               email.body.approxCost,
//               email.body.unitPrice,
//               comment
//             );
//           }
//           email.reportingToAndSupervisor[1].response = action;
//           console.log(email.status);
//           await email.save();
//           res.send(`Email approved successfully`);
//         } else if (email.status === "processing") {
//           // If the status is "processing" and action is "approved," update to "approved"
//           if (action === "approved") {
//             email.status = "Ready For Purchase";
//             email.reportingToAndSupervisor[2].Comment = comment;
//             await email.save();
//             const userEmail = email.sender;

//             await sendStatusNotificationEmail(
//               userEmail,
//               email.reportingToAndSupervisor[2].sendTo,
//               email.reportingToAndSupervisor[2].sendToName,
//               email.senderName,
//               email.body.productName,
//               email.PR_no,
//               email.body.expectedDate,
//               email.body.currentDate,
//               email.body.quantity,
//               email.body.approxCost,
//               email.body.unitPrice,
//               comment
//             );
//           } else if (action === "rejected") {
//             email.status = "rejected";
//             email.reportingToAndSupervisor[2].Comment = comment;
//             const userEmail = email.sender;

//             await RejectEmailToUser(
//               userEmail,
//               email.reportingToAndSupervisor[2].sendTo,
//               email.reportingToAndSupervisor[2].sendToName,
//               email.senderName,
//               email.body.productName,
//               email.PR_no,
//               email.body.expectedDate,
//               email.body.currentDate,
//               email.body.quantity,
//               email.body.approxCost,
//               email.body.unitPrice,
//               comment
//             );
//           }
//           email.reportingToAndSupervisor[2].response = action;

//           console.log(email.status);
//           await email.save();

//           res.send(`Email approved successfully`);
//         } else {
//           res.status(400).send("Email has already been responded.");
//         }
//       } else {
//         res.status(404).send("Email not found");
//       }
//     } else {
//       res.status(400).send("Invalid action");
//     }
//   } catch (error) {
//     res.status(500).send("Internal server error");
//   }
// });

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "client/build", "index.html"));
// });

// Start server safely with DB connection
const startServer = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await Database(); // throws if connection fails
    console.log("MongoDB connected successfully ✅");

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT} ✅`);
    });
  } catch (err) {
    console.error("Server failed to start ❌", err);
    // Exit with non-zero code so Azure knows startup failed
    process.exit(1);
  }
};

// Start everything
startServer();

// Catch unhandled promise rejections / uncaught exceptions
process.on("unhandledRejection", (reason, promise) => {
  console.error("[Unhandled Rejection]", reason);
});
process.on("uncaughtException", (err) => {
  console.error("[Uncaught Exception]", err);
});