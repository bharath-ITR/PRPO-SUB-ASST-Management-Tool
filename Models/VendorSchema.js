// models/Vendor.js
import mongoose from 'mongoose';

// Define the Vendor schema
const vendorSchema = new mongoose.Schema({
  companyname:String,
  name: {
    type: String,
    required: true,
  },
  primaryemail: {
    type: String,
    required: true,
  },
  secondaryemail: {
    type: String,
  },
  primarycontactNo: {
    type: String,
    required: true,
  },
  secondarycontactNo:{
    type: String,
   
  },
  area:{
    type:String,
    required:true,
  },
  street: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  postalCode: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  gstNo: {
    type: String,
    required: true,
  },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// Create the Vendor model
const Vendor = mongoose.model('Vendor', vendorSchema);

export default Vendor;
