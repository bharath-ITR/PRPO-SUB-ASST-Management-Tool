/* // Import required modules
import xlsx from 'xlsx';
import VendorDetails from '../Models/VendorSchema.js'; // adjust the path as needed
// Function to read data from Excel file and push to MongoDB
const ExtractVendorfromXL = async () => {
  try {
    // Read the Excel file
    const filePath = 'Assist/VendorDetails.xlsx';

    const workbook = xlsx.readFile(filePath);
    const sheet_name_list = workbook.SheetNames;
    const xlData = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

    // Iterate over the data and save each record to MongoDB
    for (const record of xlData) {
      const vendorDetails = new VendorDetails({
        Vendor_name: record['Vendor Name'],
        GST_treatment: record['GST Treatment'],
        GST: record['GST'],
        GST_no: record['GST No'],
        Vendor_address: record['Billing Address'],
      });
      await VendorDetails.deleteMany({});

     
      await vendorDetails.save();
     console.log(vendorDetails);

    }
    console.log('Data successfully imported to MongoDB');
  } catch (error) {
    console.error('Error importing data to MongoDB:', error);
  }
};

// Call the function with the path to your Excel file
export default ExtractVendorfromXL;
 */



import VendorDetails from '../Models/VendorSchema.js'
export const ExtractVendorfromXl = async (request, response) => {
  try {
    // Query the database to find documents where any of the To emails match
    const Vendor = await VendorDetails.find().sort({_id:-1}) ;
/*     const Vendor = await EmailModel.find({ 'reportingToAndSupervisor.sendTo':email });
 */    
    response.status(200).json(Vendor);
    
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: error.message });
  }
};