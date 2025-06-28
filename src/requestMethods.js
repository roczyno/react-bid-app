import axios from "axios";

// Define the base URL for your API
const BASE_URL = "https://springboot-bidding-app-api.onrender.com/api/v1";

// Retrieve the JWT token from local storage safely
let jwt = null;
try {
  const storedData = localStorage.getItem("persist:root");
  if (storedData) {
    const userData = JSON.parse(JSON.parse(storedData).user);
    jwt = userData.currentUser.jwt || null;
  }
} catch (error) {
  console.error("Error retrieving JWT token:", error);
}

// Create an Axios instance for public requests
export const publicRequest = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Create an Axios instance for user-authenticated requests
export const userRequest = axios.create({
  baseURL: BASE_URL,
  headers: jwt ? { Authorization: `Bearer ${jwt}` } : {},
  withCredentials: true,
});
