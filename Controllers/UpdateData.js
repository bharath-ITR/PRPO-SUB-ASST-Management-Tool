import EmailModel from '../Models/EmailModelSchema.js';

export const UpdatedData = async (req, res) => {
  try {
    const updatedData = req.body;
    const attachment = req.files;

    if (!updatedData.PR_no) {
      return res.status(400).json({ error: 'Cannot find PR no.' });
    }

    const filter = { 'PR_no': updatedData.PR_no };

    const updateDoc = {
      $set: {
        'body.quantity': updatedData.quantity,
        'body.productName': updatedData.productName,
        'body.location': updatedData.location,
        'body.approxCost': updatedData.approxCost,
        'body.productDescription': updatedData.productDescription,
        'body.productReason': updatedData.productReason,
        'body.purchaseType': updatedData.purchaseType,
        'body.paymentType': updatedData.paymentType,
      },
    };
  
    
    if (attachment && attachment.length > 0) {
      const attachmentDocs = attachment.map((file) => ({
        filename: file.filename,
        originalname: file.originalname,
        path: file.url,

        size: file.size,
        mimetype: file.mimetype,
      }));

      updateDoc.$push = { 'body.attachment': { $each: attachmentDocs } };
    }

    const updatedDocument = await EmailModel.updateOne(filter, updateDoc);

    if (updatedDocument.nModified === 0) {
      return res.status(404).json({ error: 'Document not found for the provided PR_no.' });
    }

    res.status(200).json({ message: 'Request updated successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};
