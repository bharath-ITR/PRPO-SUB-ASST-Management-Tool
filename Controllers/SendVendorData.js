
import Vendor from "../Models/VendorSchema.js";
export const SendVendorData = async (request, response) => {
  try {
    // Query the database to find documents where any of the To emails match
    const VendorData = await Vendor.find().sort({_id:-1}) ;
/*     const findApprover = await EmailModel.find({ 'reportingToAndSupervisor.sendTo':email });
 */    
    response.status(200).json(VendorData);
    
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: error.message });
  }
};

