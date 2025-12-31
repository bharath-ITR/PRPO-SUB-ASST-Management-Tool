import Category from "../Models/CategorySchema.js";

export const AddProduct = async (req, res) => {
    const { categoryId, product } = req.body; // Extract categoryId and product from the request body
    console.log(req.body);
    try {
        // Find the category by its ID
        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Add the new product to the products array using $push
        const updatedCategory = await Category.findByIdAndUpdate(
            categoryId,
            { $push: { products: product } }, // MongoDB's $push operator appends the product to the array
            { new: true } // Return the updated document after adding the product
        );

        res.status(200).json({ message: 'Product added successfully', category: updatedCategory });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ message: 'Error adding product', error });
    }
}

// DELETE route to delete a product by categoryId and product name
export const DeleteCategoryproduct = async (req, res) => {
    const { categoryId, product } = req.body; // Extract categoryId and product from the request body
    console.log(req.body);

    try {
        // First, find the category by its ID
        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Check if the product exists in the category's products array
        if (!category.products.includes(product)) {
            return res.status(404).json({ message: 'Product not found in category' });
        }

        // If the product exists, remove it from the products array using $pull
        const updatedCategory = await Category.findByIdAndUpdate(
            categoryId,
            { $pull: { products: product } }, // MongoDB's $pull operator removes the product from the array
            { new: true } // Return the updated document after deletion
        );

        res.status(200).json({ message: 'Product deleted successfully', category: updatedCategory });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Error deleting product', error });
    }

};

export const DeleteCategory = async (req, res) => {
    
    const Id = req.params.id;

  try {
    // Find and delete the user by ID
    const Deletecategory = await Category.findByIdAndDelete(Id);

    if (!Deletecategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ message: 'Category deleted successfully', Category: Deletecategory });
  } catch (error) {
    console.error('Error deleting Category:', error);
    res.status(500).json({ message: 'Error deleting user', error });
  }
}


export const UpdateCategoryproduct = async (req, res) => {
    const { categoryId, oldProduct, newProduct } = req.body; // Extract the old and new product names along with the categoryId

    try {
        // Find the category by its ID
        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Check if the old product exists in the products array
        const productIndex = category.products.indexOf(oldProduct);
        if (productIndex === -1) {
            return res.status(404).json({ message: 'Product not found in category' });
        }

        // Update the product at the specific index
        category.products[productIndex] = newProduct;

        // Save the updated category document
        await category.save();

        res.status(200).json({ message: 'Product updated successfully', category });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Error updating product', error });
    }

}
