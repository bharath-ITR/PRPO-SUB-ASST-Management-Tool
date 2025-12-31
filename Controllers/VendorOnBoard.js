// controllers/VendorOnBoard.js

import Vendor from "../Models/VendorSchema.js";

const VendorOnBoard = async (req, res) => {
  try {
    const vendorData = { ...req.body };
   
    const newVendor = new Vendor(vendorData);
    console.log(newVendor);
    await newVendor.save();

    // Send success response
    res.status(201).json({ message: 'Vendor successfully onboarded!', vendor: newVendor });
  } catch (error) {
    // Handle errors
    res.status(400).json({ message: 'Error onboarding vendor', error: error.message });
  }
};

export default VendorOnBoard;
