
import User from "../Models/UserSchema.js";
import bcrypt from 'bcrypt';
import { Token } from "../Token/Token.js";
export const Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ message: 'All fields are required' })
    }
    const user = await User.findOne({ email });
    /* const Admin = await User.findOne({ isAdmin:email });
    console.log(Admin); */

    if (!user) {
      return res.status(400).json({ message: 'Incorrect password or email' })
    }
    const auth = await bcrypt.compare(password, user.password)
    if (!auth) {
      return res.status(400).json({ message: 'Incorrect password or email' })
    }
   

    const token = Token(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });

    res.status(200).json({ message: "User logged in successfully", token: token, success: true, name: user.name, email: user.email,role:user.role});
  } catch (error) {
    console.error(error);
  }
}



