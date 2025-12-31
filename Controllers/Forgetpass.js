import User from "../Models/UserSchema.js";
import bcrypt from 'bcrypt';

export const Forgetpass = async (req, res) => {
    try {
        const { email, newPassword, confirmPassword } = req.body;

        // Validation
        if (!email || !newPassword || !confirmPassword) {
            return res.status(400).json({ error: 'Invalid request data' });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ error: 'Passwords is not matching' });
        }

        // Check if the email exists in the database
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(404).json({ error: 'Email not found in the database' });
        }

        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const filter = { 'email': email };
        const updateDoc = {
            $set: {
                'password': hashedPassword,
            }
        };

        // Update the document
        const updatedDocument = await User.updateOne(filter, updateDoc);

        // Check if the document was found and updated
        if (updatedDocument.nModified === 0) {
            return res.status(404).json({ error: 'Account not found' });
        }

        // Return a success response
        res.status(200).json({ message: 'Your password has been successfully changed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};
