import Category from "../Models/CategorySchema.js";
export const GetCategoryData = async (request, response) => {
  try {
    const getCategoryProducts = await Category.find();
    response.status(200).json(getCategoryProducts);
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: error.message });
  }
};