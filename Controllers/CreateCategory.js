/* /* // Controllers/CreateCategory.js

import Category from "../Models/CategorySchema.js";


// Controller function to create or update a category
const CreateCategory = async (req, res) => {
  const { category, products } = req.body;

  // Log the received data to verify its structure
  console.log('Received data:', req.body); // This should display { category: "Electronics", products: ["Laptop"] }

  // Check if category is missing or undefined
  if (!category) {
    return res.status(400).json({ message: 'Category name is required' });
  }

  try {
    // Check if a category with the given name already exists
    let existingCategory = await Category.findOne({ category });

    if (existingCategory) {
      // If the category exists, update the products list, avoiding duplicates
      existingCategory.products = [...new Set([...existingCategory.products, ...(products || [])])];
      await existingCategory.save();
      return res.status(200).json({ message: 'Category updated successfully', category: existingCategory });
    }

    // Create a new category with the provided name and products
    const newCategory = new Category({ category, products: products || [] });
    await newCategory.save();
    res.status(201).json({ message: 'Category created successfully', category: newCategory });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default CreateCategory *

import Category from "../Models/CategorySchema.js";


 const CreateCategory = async (req, res) => {
    const categories = req.body;

    try {
      // Loop through each category in the received data
      for (const [categoryName, products] of Object.entries(categories)) {
        // Check if the category already exists in the database
        let existingCategory = await Category.findOne({ category: categoryName });
  
        if (existingCategory) {
          // If the category exists, update the products list, avoiding duplicates
          existingCategory.products = [...new Set([...existingCategory.products, ...products])];
          await existingCategory.save();
          console.log(`Category "${categoryName}" updated successfully.`);
        } else {
          // Create a new category if it does not exist
          const newCategory = new Category({ category: categoryName, products });
          await newCategory.save();
          console.log(`Category "${categoryName}" created successfully.`);
        }
      }
      res.status(201).json({ message: 'Categories saved successfully' });
    } catch (error) {
      console.error('Error saving categories:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  export default CreateCategory; */


  import Category from "../Models/CategorySchema.js";

const CreateCategory = async (req, res) => {
  const categories = req.body;

  // Log the received data to verify its structure
  console.log('Received categories:', categories); // This should display [{ category: "abc", products: ["laptop"] }]

  try {
    // Loop through each category in the received data
    for (const { category, products } of categories) {
      // Check if the category already exists in the database
      let existingCategory = await Category.findOne({ category });

      if (existingCategory) {
        // If the category exists, update the products list, avoiding duplicates
        existingCategory.products = [...new Set([...existingCategory.products, ...products])];
        await existingCategory.save();
        console.log(`Category "${category}" updated successfully.`);
      } else {
        // Create a new category if it does not exist
        const newCategory = new Category({ category, products });
        await newCategory.save();
        console.log(`Category "${category}" created successfully.`);
      }
    }
    res.status(201).json({ message: 'Categories saved successfully' });
  } catch (error) {
    console.error('Error saving categories:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default CreateCategory;
