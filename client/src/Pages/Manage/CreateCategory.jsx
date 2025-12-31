import  { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCategory } from "../../redux/Action";
import axios from "axios";
import "./CreateCategory.css";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const CategoryProductForm = () => {
  const apiUrl = process.env.REACT_APP_API;

  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [productInput, setProductInput] = useState("");
  const [newProductInput, setNewProductInput] = useState("");
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(null);
  const [categorySubmitted, setCategorySubmitted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [showProductInput, setShowProductInput] = useState(false);
  const [editProductIndex, setEditProductIndex] = useState(null);
  const [editProductInput, setEditProductInput] = useState("");
  const dispatch = useDispatch();
  const { Categories } = useSelector((state) => state.getCategory);

  useEffect(() => {
    dispatch(getCategory());
  }, [dispatch]);

  const addCategory = () => {
    if (categoryName.trim()) {
      const newCategory = { name: categoryName, products: [] };
      setCategories([...categories, newCategory]);
      setCategoryName("");
      setCurrentCategoryIndex(categories.length);
      setCategorySubmitted(true);
    }
  };

  const addProduct = () => {
    if (currentCategoryIndex !== null && productInput.trim()) {
      const updatedCategories = [...categories];
      updatedCategories[currentCategoryIndex].products.push(productInput);
      setCategories(updatedCategories);
      setProductInput("");
    }
  };

  const deleteProduct = (productIndex) => {
    if (currentCategoryIndex !== null) {
      const confirmation = window.confirm("Are you sure you want to delete this product?");
      if (confirmation) {
        const updatedCategories = [...categories];
        updatedCategories[currentCategoryIndex].products.splice(productIndex, 1);
        setCategories(updatedCategories);
      }
    }
  };

  const deleteCategory = (categoryIndex) => {
    const confirmation = window.confirm("Are you sure you want to delete this category?");
    if (confirmation) {
      const updatedCategories = [...categories];
      updatedCategories.splice(categoryIndex, 1);
      setCategories(updatedCategories);
      if (currentCategoryIndex === categoryIndex) {
        setCurrentCategoryIndex(null);
        setCategorySubmitted(false);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const data = categories.map((category) => ({
        category: category.name,
        products: category.products,
      }));

      await axios.post(`${apiUrl}/create-category`, data);
      alert("Categories and products submitted successfully");
      setCategorySubmitted(false);
      setCurrentCategoryIndex(null);
      setCategories([]);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const handleCategorySelect = (e) => {
    const selectedCategoryName = e.target.value;
    setSelectedCategory(selectedCategoryName);

    const selectedCatObj = Categories.find((cat) => cat.category === selectedCategoryName);

    if (selectedCatObj) {
      setProducts(selectedCatObj.products);
      setSelectedCategoryId(selectedCatObj._id);
    } else {
      setProducts([]);
    }
  };

  const deleteSelectedCategory = async () => {
    const confirmation = window.confirm("Are you sure you want to delete this category?");
    
    if (confirmation && selectedCategoryId) {
      try {
        // API call to delete the selected category
        await axios.delete(`${apiUrl}/delete-category/${selectedCategoryId}`);
  
        // Refresh Redux state by dispatching getCategories (assuming this is available)
        dispatch(getCategory()); // Ensure it refreshes the global state for categories
  
        // Update local state for better UX while Redux updates
        const updatedCategories = categories.filter((cat) => cat._id !== selectedCategoryId);
        setCategories(updatedCategories);
  
        // Clear the selected category and products state
        setSelectedCategory(""); 
        setProducts([]); // Clear the products list as the category is deleted
        setSelectedCategoryId(""); // Reset selected category ID
        
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };
  
  const handleAddProductToCategory = async () => {
    if (selectedCategoryId && newProductInput.trim()) {
      try {
        // API call to add a new product to the category
        const response = await axios.post(`${apiUrl}/add-product`, {
          categoryId: selectedCategoryId,
          category: selectedCategory,
          product: newProductInput,
        });
  
        // Update local state for products in the selected category
        setProducts([...products, newProductInput]);
  
        // Update the local categories state to reflect the new product in the selected category
        const updatedCategories = categories.map((cat) =>
          cat._id === selectedCategoryId
            ? { ...cat, products: [...cat.products, newProductInput] }
            : cat
        );
        setCategories(updatedCategories);
  
        // Optionally, dispatch an action to refresh the categories in Redux state
        dispatch(getCategory()); // Refresh the Redux state for the selected category
  
        // Clear input field and hide product input box
        setNewProductInput("");
        setShowProductInput(false);
      } catch (error) {
        console.error("Error adding product:", error);
      }
    }
  };
  

const deleteSelectedProduct = async (product) => {
  const confirmation = window.confirm("Are you sure you want to delete this product?");
  if (confirmation && selectedCategoryId) {
    try {
      await axios.delete(`${apiUrl}/delete-product`, {
        data: {
          categoryId: selectedCategoryId,
          product: product,
        },
      });

      // Refresh Redux state by dispatching getCategory
      dispatch(getCategory()); // Ensure this refreshes the global state

      // Optionally, update local state for better UX while waiting for Redux
      const updatedProducts = products.filter((prod) => prod !== product);
      setProducts(updatedProducts);
      setSelectedCategoryId(""); // Reset the selected category

    } catch (error) {
      console.error("Error deleting product:", error);
    }
  }
};




  const handleEditProduct = (index) => {
    setEditProductIndex(index);
    setEditProductInput(products[index]);
  };

  const handleSaveEditProduct = async () => {
    if (selectedCategoryId && editProductInput.trim()) {
      try {
        // Retrieve the old product before editing
        const oldProduct = products[editProductIndex];
  
        // API call to update the product in the category
        await axios.put(`${apiUrl}/edit-product`, {
          categoryId: selectedCategoryId,
          oldProduct: oldProduct,
          newProduct: editProductInput,
        });
  
        // Update local products state
        const updatedProducts = products.map((prod, i) =>
          i === editProductIndex ? editProductInput : prod
        );
        setProducts(updatedProducts);
  
        // Update local categories state for instant UI feedback
        const updatedCategories = categories.map((cat) =>
          cat._id === selectedCategoryId
            ? { ...cat, products: updatedProducts }
            : cat
        );
        setCategories(updatedCategories);
  
        // Optionally, dispatch action to refresh Redux categories state
        dispatch(getCategory()); // Refresh Redux with updated category and product
  
        // Reset edit states
        setEditProductIndex(null); // Clear edit mode
        setEditProductInput(""); // Clear input field
      } catch (error) {
        console.error("Error editing product:", error);
      }
    }
  };
  
  return (
    <div className="container1">
      <div className="flex-row">
        <div className="add-category-container">
          <h2>Add Category +</h2>
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Enter Category Name"
            disabled={categorySubmitted}
            style={{ padding: "5px" }}
          />
          <button
            onClick={addCategory}
            disabled={categorySubmitted}
            className="add-category-button"
          >
            Add Category
          </button>

          {categories.length > 0 && (
            <div className="category-list-container">
              <h3>Categories</h3>
              <ul>
                {categories.map((category, index) => (
                  <li key={index}>
                    <strong>{category.name}</strong>
                    <DeleteIcon
                      onClick={() => deleteCategory(index)}
                      className="delete-icon"
                    />
                    {currentCategoryIndex === index && (
                      <div className="product-input">
                        <input
                          type="text"
                          value={productInput}
                          onChange={(e) => setProductInput(e.target.value)}
                          placeholder={`Add product to ${category.name}`}
                        />
                        <button onClick={addProduct} className="add-button">
                          Add Product
                        </button>
                      </div>
                    )}

                    {category.products.length > 0 && (
                      <ul className="product-list">
                        {category.products.map((product, i) => (
                          <li key={i}>
                            {product}
                            <RemoveCircleOutlineIcon
                              onClick={() => deleteProduct(i)}
                              className="remove-icon"
                            />
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
              {categorySubmitted && (
                <button onClick={handleSubmit} className="submit-button1">
                  Submit
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex-column">
        <h2>Select Existing Category</h2>
  <select
    className="category-dropdown"
    onChange={handleCategorySelect}
    value={selectedCategory}
  >
    <option value="">Categories</option>
    {Categories.map((category) => (
      <option key={category._id} value={category.category}>
        {category.category}
      </option>
    ))}
  </select>

  {selectedCategory && (
    <div className="product-management">
      <h3>Products in {selectedCategory}</h3>
      <ul className="product-list">
        {products.map((product, index) => (
          <li key={index} className="product-item">
            {editProductIndex === index ? (
              <div className="edit-product">
                <input
                  type="text"
                  value={editProductInput}
                  onChange={(e) => setEditProductInput(e.target.value)}
                  className="edit-input"
                />
                <button
                  onClick={handleSaveEditProduct}
                  className="save-edit-button"
                >
                  Save
                </button>
              </div>
            ) : (
              <span>{product}</span>
            )}
            <div className="product-action-buttons">
              <button
                onClick={() => handleEditProduct(index)}
                className="edit-button"
              >
                <EditIcon />
              </button>
              <button
                onClick={() => deleteSelectedProduct(product)}
                className="delete-button"
              >
                <DeleteOutlineIcon />
              </button>
            </div>
          </li>
        ))}
      </ul>
      {!showProductInput ? (
        <button
          onClick={() => setShowProductInput(true)}
          className="add-product-button"
        >
          Add Product
        </button>
      ) : (
        <div className="add-product-input">
          <input
            type="text"
            value={newProductInput}
            onChange={(e) => setNewProductInput(e.target.value)}
            placeholder="New Product"
            className="product-input-field"
          />
          <button
            onClick={handleAddProductToCategory}
            className="add-product-confirm-button"
          >
            Add
          </button>
        </div>
      )}
      <button
        onClick={deleteSelectedCategory}
        className="delete-category-button"
      >
        Delete Category
      </button>
    </div>
  )}
        </div>
      </div>
    </div>
  );
};

export default CategoryProductForm;
