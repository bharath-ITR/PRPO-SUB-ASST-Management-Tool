
import bcrypt from 'bcrypt';
import { Token } from "../Token/Token.js";
import Admin from '../Models/AdminSchema.js';
export const AdminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ message: 'All fields are required' })
    }
    const admin = await Admin.findOne({ email });

    if (!admin) {

      return res.json({ message: 'Incorrect password or email' })
    }
    const auth = await bcrypt.compare(password, admin.password)
    if (!auth) {
      return res.json({ message: 'Incorrect password or email' })
    }
    const token = Token(admin._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
     
    res.status(200).json({ message: "Admin logged in successfully", token: token, success: true,name:admin.name,email: admin.email});
   
  } catch (error) {
    console.error(error);
  }
}



