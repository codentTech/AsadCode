import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import invitationService from "./invitation.service";

const initialState = {
  sendInvitation: {
    data: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
  },
};

export const sendInvitation = createAsyncThunk(
  "invitation/sendInvitation",
  async (invitationData, thunkAPI) => {
    const response = await invitationService.sendInvitation(invitationData);
    if (response.success) return response;
    return thunkAPI.rejectWithValue(response);
  }
);

const invitationSlice = createSlice({
  name: "invitation",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendInvitation.pending, (state) => {
        state.sendInvitation.isLoading = true;
        state.sendInvitation.isSuccess = false;
        state.sendInvitation.isError = false;
      })
      .addCase(sendInvitation.fulfilled, (state, action) => {
        state.sendInvitation.isLoading = false;
        state.sendInvitation.isSuccess = true;
        state.sendInvitation.data = action.payload;
      })
      .addCase(sendInvitation.rejected, (state, action) => {
        state.sendInvitation.isLoading = false;
        state.sendInvitation.isError = true;
        state.sendInvitation.data = action.payload;
      });
  },
});

export default invitationSlice.reducer;
