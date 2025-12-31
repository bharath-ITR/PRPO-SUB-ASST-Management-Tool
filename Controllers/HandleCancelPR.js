import EmailModel from "../Models/EmailModelSchema.js";

// Endpoint to update the status of a request to "block"
const HandleCancelPR=async(req, res) => {
  const { prNo } = req.params;

  try {
    // Find the request by PR number and update the isBlocked field to true
    const request = await EmailModel.findOneAndUpdate(
      { PR_no: prNo },
      { isBlocked: true },
      { new: true } // Return the updated document
    );

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.status(200).json({ message: 'Request cancelled successfully', request });
  } catch (error) {
    console.error('Error cancelling request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default HandleCancelPR;
