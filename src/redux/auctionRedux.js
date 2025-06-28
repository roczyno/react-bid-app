import { createSlice } from "@reduxjs/toolkit";

export const auctionSlice = createSlice({
  name: "auction",
  initialState: {
    auctions: [],
    isFetching: false,
    error: false,
  },
  reducers: {
    //GET ALL
    getAuctionStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    getAuctionSuccess: (state, action) => {
      state.isFetching = false;
      state.auctions = action.payload;
    },
    getAuctionFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
  },
});

export const { getAuctionStart, getAuctionFailure, getAuctionSuccess } =
  auctionSlice.actions;
export default auctionSlice.reducer;
