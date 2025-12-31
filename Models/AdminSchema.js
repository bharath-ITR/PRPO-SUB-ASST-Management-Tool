
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';


const adminSchema = new mongoose.Schema({
   id:{
    type: String,
   },
    name: {
        type: String,
        required: [true, "Your username is required"],
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
   
    createdAt: {
        type: Date,
        default: new Date(),
    },
    
});

adminSchema.pre("save", async function () {
    this.password = await bcrypt.hash(this.password, 12);
});

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;