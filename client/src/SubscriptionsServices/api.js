import axios from "axios";

// Use PR-PO backend API URL - will use the same backend
const baseURL = process.env.REACT_APP_API 
  ? `${process.env.REACT_APP_API}/api` 
  : "http://localhost:8080/api";

export const api = axios.create({
  baseURL
});

