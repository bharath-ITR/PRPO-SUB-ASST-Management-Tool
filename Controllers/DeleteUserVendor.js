import User from "../Models/UserSchema.js";
import Vendor from "../Models/VendorSchema.js";
import bcrypt from 'bcrypt';

// Function to delete a user or vendor based on the ID
export const DeleteEntity = async (req, res) => {
  const ID = req.params.id; // ID of the entity to be deleted
  console.log(ID);

  try {
    // Attempt to delete the entity from the User collection
    const deletedUser = await User.findByIdAndDelete(ID);

    // If the entity was not found in the User collection, try the Vendor collection
    const deletedVendor = !deletedUser ? await Vendor.findByIdAndDelete(ID) : null;

    // If neither a user nor a vendor was found and deleted, return a 404 response
    if (!deletedUser && !deletedVendor) {
      return res.status(404).json({ message: 'Entity not found' });
    }

    // Determine the success message based on which entity was deleted
    const message = deletedUser 
      ? 'User deleted successfully' 
      : 'Vendor deleted successfully';

    // Return the success message along with the deleted entity details
    res.status(200).json( message);
  } catch (error) {
    console.error('Error deleting entity:', error);
    res.status(500).json({ message: 'Error deleting entity', error });
  }
};


export const UpdatePassword = async (req, res) => {
    const userId = req.params.id;
    const { password } = req.body;
    console.log(req.body);
    if (!password) {
        return res.status(400).json({ message: 'New password is required' });
    }

    try {
        // Hash the new password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Find the user by ID and update the password
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { password: hashedPassword },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Password updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ message: 'Error updating password', error });
    }
};

export const UpdateVendor= async(req, res) => {
  const vendorId = req.params.id;
  const updateData = req.body;

  try {
    // Find the vendor by ID and update its information
    const updatedVendor = await Vendor.findByIdAndUpdate(
      vendorId,
      updateData,
      { new: true }
    );

    if (!updatedVendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    res.status(200).json({ message: 'Vendor updated successfully', vendor: updatedVendor });
  } catch (error) {
    console.error('Error updating vendor:', error);
    res.status(500).json({ message: 'Error updating vendor', error });
  }
};