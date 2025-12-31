
import Admin from '../Models/AdminSchema.js';
import { Token } from '../Token/Token.js';
export const AdminRegister = async (req, res, next) => {
  try {
    const { email, password, name, createdAt } = req.body;
    const existingUser = await Admin.findOne({ email });
    if (existingUser) {
      return res.json({ message: "Admin already exists" });
    }
    const user = await Admin.create({ name,email, password, createdAt });
    console.log(user);
    const token = Token(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res
      .status(201)
      .json({ message: "Admin signed in successfully",token:token, success: true, name:user.name,email: user.email });
    next();
  } catch (error) {
    console.error(error);
  }
};