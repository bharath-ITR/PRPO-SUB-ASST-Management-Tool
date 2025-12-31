import EmailModel from "../Models/EmailModelSchema.js";
import User from "../Models/UserSchema.js";

export const Allusers = async (request, response) => {
  try {
    // Sort directly using MongoDB query
    const getAllUsers = await User.find().sort({ _id: -1 });

    console.log(getAllUsers);
    response.status(200).json(getAllUsers);
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: error.message });
  }
};

// export const AllDataForDashboard = async (req, res) => {
//   try {
//     // 1️⃣ Status counts (for StatusChart)
//     const statusCounts = await EmailModel.aggregate([
//       { $group: { _id: "$status", count: { $sum: 1 } } }
//     ]);

//     // 2️⃣ Monthly counts grouped by status (for MonthlyGraph & SummaryGraph)
//     const monthlyStatusCounts = await EmailModel.aggregate([
//       {
//         $group: {
//           _id: {
//             status: "$status",
//             month: { $month: { $toDate: "$body.currentDate" } }
//           },
//           count: { $sum: 1 }
//         }
//       },
//       { $sort: { "_id.month": 1 } }
//     ]);

//     // 3️⃣ Processing by currency (for WidgetBox)
//     const processingCurrency = await EmailModel.aggregate([
//       { $match: { status: "processing" } },
//       {
//         $group: {
//           _id: {
//             currency: { $arrayElemAt: [{ $split: ["$body.approxCost", " "] }, 0] }
//           },
//           count: { $sum: 1 },
//           totalAmount: {
//             $sum: {
//               $toDouble: {
//                 $arrayElemAt: [{ $split: ["$body.approxCost", " "] }, 1]
//               }
//             }
//           }
//         }
//       }
//     ]);

//     // Build response object
//     const dashboardData = {
//       statusCounts,          // total per status
//       monthlyStatusCounts,   // status per month
//       processingCurrency     // counts & totals per currency
//     };

//     return res.status(200).json(dashboardData);
//   } catch (error) {
//     console.error("Error in AllDataForDashboard:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };

export const AllDataForDashboard = async (req, res) => {
  try {
    // 1️⃣ Status counts (for StatusChart)
    const data = await EmailModel.find();

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error in AllDataForDashboard:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const AllData = async (req, res) => {
  try {
    const { search = "" } = req.query;
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
    const skip = (page - 1) * limit;

    let query = { status: "Ready For Purchase" };

    if (search) {
      query.$or = [
        { subject: { $regex: search, $options: "i" } },
        { PR_no: { $regex: search, $options: "i" } },
        { senderName: { $regex: search, $options: "i" } },
        { "body.productName": { $regex: search, $options: "i" } },
        { "body.sender_name": { $regex: search, $options: "i" } },
      ];
    }

    const projection = `
      sender subject PR_no status dateSent isPOcreated isBlocked
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

    `;

    const [data, total] = await Promise.all([
      EmailModel.find(query)
        .select(projection)
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      EmailModel.countDocuments(query),
    ]);

    return res.status(200).json({
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 0,
      totalRecords: total,
      data,
    });
  } catch (error) {
    console.error("Error in getUserData:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const DataById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("IDDDDD", id);

    const projection = `
      sender subject PR_no status dateSent isPOcreated isBlocked
      body.usermail body.sender_name body.currentDate body.expectedDate
      body.purchaseType body.location body.productName
      body.quantity body.productDescription body.unitPrice body.approxCost
      body.totalAmount body.currency body.paymentType
    `;

    // if you want to fetch by PR_no
    const data = await EmailModel.findOne({ PR_no: id })
      .select(projection)
      .lean();

    if (!data) {
      return res.status(404).json({ message: "PR not found" });
    }

    return res.status(200).json({ data });
  } catch (error) {
    console.error("Error in getUserData:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const AllDataForReports = async (req, res) => {
  try {
    const { search = "", fromDate, toDate, status } = req.query;
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
    const skip = (page - 1) * limit;

    let query = {};

    // ------------------ SEARCH FILTER ------------------
    if (search) {
      query.$or = [
        { subject: { $regex: search, $options: "i" } },
        { PR_no: { $regex: search, $options: "i" } },
        { senderName: { $regex: search, $options: "i" } },
        { "body.productName": { $regex: search, $options: "i" } },
        { "body.sender_name": { $regex: search, $options: "i" } },
      ];
    }

    // ------------------ STATUS FILTER (NEW) ------------------
    // ------------------ STATUS FILTER (NORMALIZED ON BOTH SIDES) ------------------
    if (status) {
      const normalizedIncoming = status.replace(/\s+/g, "").toLowerCase();

      query.$expr = {
        $eq: [
          {
            $toLower: {
              $replaceAll: {
                input: "$status",
                find: " ",
                replacement: "",
              },
            },
          },
          normalizedIncoming,
        ],
      };
    }

    // ------------------ DATE RANGE FILTER ------------------
    if (fromDate && toDate) {
      query.$expr = {
        ...(query.$expr || {}),
        $and: [
          ...(query.$expr?.$and || []),
          {
            $gte: [
              {
                $dateFromString: {
                  dateString: "$body.currentDate",
                  format: "%m/%d/%Y",
                },
              },
              new Date(fromDate),
            ],
          },
          {
            $lte: [
              {
                $dateFromString: {
                  dateString: "$body.currentDate",
                  format: "%m/%d/%Y",
                },
              },
              new Date(toDate),
            ],
          },
        ],
      };
    }

    // ------------------ PROJECTION ------------------
    const projection = `
      sender subject PR_no status dateSent isPOcreated isBlocked
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
    `;

    const [data, total] = await Promise.all([
      EmailModel.find(query)
        .select(projection)
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      EmailModel.countDocuments(query),
    ]);

    return res.status(200).json({
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 0,
      totalRecords: total,
      data,
    });
  } catch (error) {
    console.error("Error in AllDataForReports:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
