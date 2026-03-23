import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import notificationService from "./notification.service";

const initialState = {
  getMyNotifications: {
    data: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
  },
  getActionRequiredNotifications: {
    data: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
  },
  getUnreadCount: {
    data: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
  },
};

export const getMyNotifications = createAsyncThunk(
  "notification/getMyNotifications",
  async (campaignId, thunkAPI) => {
    const response = await notificationService.getMyNotifications(campaignId);
    if (response.success) return response;
    return thunkAPI.rejectWithValue(response);
  }
);

export const getActionRequiredNotifications = createAsyncThunk(
  "notification/getActionRequiredNotifications",
  async (campaignId, thunkAPI) => {
    const response = await notificationService.getActionRequiredNotifications(campaignId);
    if (response.success) return response;
    return thunkAPI.rejectWithValue(response);
  }
);

export const getUnreadCount = createAsyncThunk(
  "notification/getUnreadCount",
  async (_, thunkAPI) => {
    const response = await notificationService.getUnreadCount();
    if (response.success) return response;
    return thunkAPI.rejectWithValue(response);
  }
);

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMyNotifications.pending, (state) => {
        state.getMyNotifications.isLoading = true;
        state.getMyNotifications.isSuccess = false;
        state.getMyNotifications.isError = false;
      })
      .addCase(getMyNotifications.fulfilled, (state, action) => {
        state.getMyNotifications.isLoading = false;
        state.getMyNotifications.isSuccess = true;
        state.getMyNotifications.data = action.payload;
      })
      .addCase(getMyNotifications.rejected, (state, action) => {
        state.getMyNotifications.isLoading = false;
        state.getMyNotifications.isError = true;
        state.getMyNotifications.data = action.payload;
      });

    builder
      .addCase(getActionRequiredNotifications.pending, (state) => {
        state.getActionRequiredNotifications.isLoading = true;
        state.getActionRequiredNotifications.isSuccess = false;
        state.getActionRequiredNotifications.isError = false;
      })
      .addCase(getActionRequiredNotifications.fulfilled, (state, action) => {
        state.getActionRequiredNotifications.isLoading = false;
        state.getActionRequiredNotifications.isSuccess = true;
        state.getActionRequiredNotifications.data = action.payload;
      })
      .addCase(getActionRequiredNotifications.rejected, (state, action) => {
        state.getActionRequiredNotifications.isLoading = false;
        state.getActionRequiredNotifications.isError = true;
        state.getActionRequiredNotifications.data = action.payload;
      });

    builder
      .addCase(getUnreadCount.pending, (state) => {
        state.getUnreadCount.isLoading = true;
        state.getUnreadCount.isSuccess = false;
        state.getUnreadCount.isError = false;
      })
      .addCase(getUnreadCount.fulfilled, (state, action) => {
        state.getUnreadCount.isLoading = false;
        state.getUnreadCount.isSuccess = true;
        state.getUnreadCount.data = action.payload;
      })
      .addCase(getUnreadCount.rejected, (state, action) => {
        state.getUnreadCount.isLoading = false;
        state.getUnreadCount.isError = true;
        state.getUnreadCount.data = action.payload;
      });
  },
});

export default notificationSlice.reducer;
