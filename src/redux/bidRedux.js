import { createSlice } from "@reduxjs/toolkit";

const bidSlice = createSlice({
  name: "bid",
  initialState: {
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    bidRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    bidSuccess: (state) => {
      state.loading = false;
      state.success = true;
    },
    bidFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { bidRequest, bidSuccess, bidFailure } = bidSlice.actions;
export default bidSlice.reducer;
