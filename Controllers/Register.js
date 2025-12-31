
import User from '../Models/UserSchema.js';
import { Token } from '../Token/Token.js';
export const Register = async (req, res, next) => {
  try {
    const { email, password, name, createdAt } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ message: "User already exists" });
    }
    const user = await User.create({ name,email, password, createdAt });
    console.log(user);
    const token = Token(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res
      .status(201)
      .json({ message: "User signed in successfully",token:token, success: true, name:user.name,email: user.email,role:user.role });
    next();
  } catch (error) {
    console.error(error);
  }
};