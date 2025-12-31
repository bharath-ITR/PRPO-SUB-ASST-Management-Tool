import EmailModel from "../Models/EmailModelSchema.js";
// export const getUserData = async (request, response) => {
//   try {
//     const { email } = request.body;

//     const getuserData = await EmailModel.find({sender:email} ).sort({_id:-1}) ;

//     response.status(200).json(getuserData);
//   } catch (error) {
//     console.log(error);
//     response.status(500).json({ message: error.message });
//   }
// };


/**
 * Fetch paginated emails sent by a given user.
 * - Paginates results (default 10 per page).
 * - Filters by sender email, using request.query.email.
 * - Returns only required fields.
 * - Responds with page info and data array.
 */
export const getUserData = async (req, res) => {
  try {
    const { email, search = "" } = req.query;
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
    const skip = (page - 1) * limit;

    if (!email) {
      return res.status(400).json({ message: "Valid email is required" });
    }

    const query = { sender: email };

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
