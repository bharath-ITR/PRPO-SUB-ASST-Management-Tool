
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
   id:{
    type: String,
   },
    name: {
        type: String,
        required: [true, "Your username is required"],
        unique: true,

    },
    
    email: {
        type: String,
        required: [true, "Your email address is required"],
        unique: true,
    },

    password: {
        type: String,
        required: [true, "Your password is required"],
    },
   role: {
    type: String,
    enum: ['user','admin'],
    default: 'user',
  },
  
      createdAt: {
        type: Date,
        default: new Date(),
    },
});

userSchema.pre("save", async function () {
    this.password = await bcrypt.hash(this.password, 12);
});

const User = mongoose.model("User", userSchema);

export default User;
/* 
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const emailModelSchema = new mongoose.Schema({
  sender: String,
  To: [String],
  subject: String,
  PR_no: String,
  body: {
    usermail: String,
    date: String,
    department: String,
    location: String,
    productName: String,
    productReason: String,
    quantity: String,
    productDescription: String,
    approxCost: Number,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'approved', 'rejected', 'Ready For Purchase', 'completed'],
    default: 'pending',
  },
  dateSent: Date,
  reportingToAndSupervisor: [
    {
      sendTo: String,
      tokens: {
        approve: String,
        reject: String,
      },
      response: String,
    },
    {
      sendTo: String,
      tokens: {
        approve: String,
        reject: String,
      },
      response: String,
    },
    {
      sendTo: String,
      tokens: {
        approve: String,
        reject: String,
      },
      response: String,
    },
  ],
});

const userSchema = new mongoose.Schema({
  id: {
    type: String,
  },
  name: {
    type: String,
    unique:true,
    required: [true, 'Your username is required'],
  },
  email: {
    type: String,
    required: [true, 'Your email address is required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Your password is required'],
  },
  userData: {
    type: [emailModelSchema], // Store email-related information here
    default: [],
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  // Store email-related information here
});

userSchema.pre('save', async function () {
  this.password = await bcrypt.hash(this.password, 12);
});

const User = mongoose.model('User', userSchema);

export default User;
 */