/* // models/Category.js
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    category: {
    type: String,
    required: true,
  },
  products: {
    type: [String], // Array of product names
    default: [],
  },
});

const Category = mongoose.model('Category', categorySchema);

export default Category; */

import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  category: { type: String },
  products: [{ type: String }] // This ensures products is an array of strings
});

const Category = mongoose.model('Category', categorySchema);

export default Category;
