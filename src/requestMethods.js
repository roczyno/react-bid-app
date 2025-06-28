import axios from "axios";

// Define the base URL for your API
const BASE_URL = "http://localhost:3000/api/v1";

// Create an Axios instance for public requests
export const publicRequest = axios.create({
  baseURL: BASE_URL,
});

// Create an Axios instance for user-authenticated requests
export const userRequest = axios.create({
  baseURL: BASE_URL,
});

// Add request interceptor to include auth token
userRequest.interceptors.request.use(
  (config) => {
    try {
      const storedData = localStorage.getItem("persist:root");
      if (storedData) {
        const userData = JSON.parse(JSON.parse(storedData).user);
        const token = userData.currentUser?.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.error("Error retrieving auth token:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
userRequest.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem("persist:root");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);