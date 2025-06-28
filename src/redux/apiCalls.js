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
    toast(res.data.message);
    dispatch(loginSuccess(res.data));
  } catch (error) {
    toast(error.response.data[0].error);
    dispatch(loginFailure());
  }
};

export const getAuctions = async (dispatch) => {
  dispatch(getAuctionStart());
  try {
    const res = await publicRequest.get("/auction?newAuction=true");
    dispatch(getAuctionSuccess(res.data));
  } catch (error) {
    toast(error.response.data[0].error);
    dispatch(getAuctionFailure(error));
    console.log(error);
  }
};

export const addBid = async (dispatch, info, auctionId) => {
  try {
    dispatch(bidRequest());
    const res = await userRequest.post(`/bid/auction/${auctionId}`, info);
    toast(res.data);
    dispatch(bidSuccess());
    await getAuctions(dispatch);
  } catch (error) {
    toast(error.response.data[0].error);
    dispatch(bidFailure(error));
    console.log(error);
  }
};
