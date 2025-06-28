import { publicRequest, userRequest } from "../requestMethods";
import {
  getAuctionFailure,
  getAuctionStart,
  getAuctionSuccess,
} from "./auctionRedux";
import { bidFailure, bidRequest, bidSuccess } from "./bidRedux";
import { loginFailure, loginStart, loginSuccess } from "./userRedux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const login = async (dispatch, user) => {
  try {
    dispatch(loginStart());
    const res = await publicRequest.post("/auth/login", user);
    toast.success(res.data.message);
    dispatch(loginSuccess(res.data));
    return res.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || "Login failed";
    toast.error(errorMessage);
    dispatch(loginFailure());
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const res = await publicRequest.post("/auth/register", userData);
    toast.success(res.data.message);
    return res.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || "Registration failed";
    toast.error(errorMessage);
    throw error;
  }
};

export const getAuctions = async (dispatch, params = {}) => {
  dispatch(getAuctionStart());
  try {
    const res = await publicRequest.get("/auctions", { params });
    dispatch(getAuctionSuccess(res.data));
    return res.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || "Failed to fetch auctions";
    toast.error(errorMessage);
    dispatch(getAuctionFailure(error));
    throw error;
  }
};

export const getAuction = async (id) => {
  try {
    const res = await publicRequest.get(`/auctions/${id}`);
    return res.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || "Failed to fetch auction";
    toast.error(errorMessage);
    throw error;
  }
};

export const createAuction = async (auctionData) => {
  try {
    const res = await userRequest.post("/auctions", auctionData);
    toast.success("Auction created successfully!");
    return res.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || "Failed to create auction";
    toast.error(errorMessage);
    throw error;
  }
};

export const addBid = async (dispatch, bidData, auctionId) => {
  try {
    dispatch(bidRequest());
    const res = await userRequest.post("/bids", {
      auctionId,
      amount: bidData.amount
    });
    toast.success("Bid placed successfully!");
    dispatch(bidSuccess());
    // Refresh auctions after successful bid
    await getAuctions(dispatch);
    return res.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || "Failed to place bid";
    toast.error(errorMessage);
    dispatch(bidFailure(error));
    throw error;
  }
};

export const getUserAuctions = async (params = {}) => {
  try {
    const res = await userRequest.get("/auctions/user/my-auctions", { params });
    return res.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || "Failed to fetch user auctions";
    toast.error(errorMessage);
    throw error;
  }
};

export const getUserBids = async (params = {}) => {
  try {
    const res = await userRequest.get("/bids/my-bids", { params });
    return res.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || "Failed to fetch user bids";
    toast.error(errorMessage);
    throw error;
  }
};

export const getAuctionBids = async (auctionId, params = {}) => {
  try {
    const res = await userRequest.get(`/bids/auction/${auctionId}`, { params });
    return res.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || "Failed to fetch auction bids";
    toast.error(errorMessage);
    throw error;
  }
};

export const sendMessage = async (messageData) => {
  try {
    const res = await userRequest.post("/messages", messageData);
    return res.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || "Failed to send message";
    toast.error(errorMessage);
    throw error;
  }
};

export const getConversation = async (userId, params = {}) => {
  try {
    const res = await userRequest.get(`/messages/conversation/${userId}`, { params });
    return res.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || "Failed to fetch conversation";
    toast.error(errorMessage);
    throw error;
  }
};

export const getConversations = async (params = {}) => {
  try {
    const res = await userRequest.get("/messages/conversations", { params });
    return res.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || "Failed to fetch conversations";
    toast.error(errorMessage);
    throw error;
  }
};

export const getUserProfile = async () => {
  try {
    const res = await userRequest.get("/users/profile");
    return res.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || "Failed to fetch profile";
    toast.error(errorMessage);
    throw error;
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    const res = await userRequest.put("/users/profile", profileData);
    toast.success("Profile updated successfully!");
    return res.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || "Failed to update profile";
    toast.error(errorMessage);
    throw error;
  }
};

export const getNotifications = async (params = {}) => {
  try {
    const res = await userRequest.get("/notifications", { params });
    return res.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || "Failed to fetch notifications";
    toast.error(errorMessage);
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    const res = await userRequest.put(`/notifications/${notificationId}/read`);
    return res.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || "Failed to mark notification as read";
    toast.error(errorMessage);
    throw error;
  }
};