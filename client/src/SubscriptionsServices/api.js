import axios from "axios";

// Use PR-PO backend API URL - will use the same backend
const baseURL = process.env.REACT_APP_API 
  ? `${process.env.REACT_APP_API}/api` 
  : "http://localhost:8080/api";

export const api = axios.create({
  baseURL
});

// Fetch all users for owner selection
export const getUsers = async () => {
  try {
    const apiUrl = process.env.REACT_APP_API || "http://localhost:8080";
    const response = await axios.get(`${apiUrl}/allUsers`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    // Return empty array on error so the modal can still work
    return [];
  }
};

