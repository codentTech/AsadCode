import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import dashboardService from "./dashboard.service";

const getSerializableError = (error) => {
  if (error?.response?.data?.message) {
    return { message: error.response.data.message };
  }
  if (error?.message) {
    return { message: error.message };
  }
  if (typeof error === "string") {
    return { message: error };
  }
  return { message: "An unexpected error occurred" };
};

const generalState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
  data: null,
};

const initialState = {
  adminDashboardSummary: { ...generalState },
  fetchAllUserWaitinglist: { ...generalState },
};

export const fetchAdminDashboardSummary = createAsyncThunk(
  "dashboard/adminSummary",
  async (_, thunkAPI) => {
    try {
      const response = await dashboardService.getAdminDashboardSummary();
      if (response.success) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error));
    }
  }
);

export const fetchAllUserWaitinglist = createAsyncThunk(
  "dashboard/waiting-list",
  async (_, thunkAPI) => {
    try {
      const response = await dashboardService.fetchAllUserWaitinglist();

      if (response.success) {
        return response;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    reset: (state) => {
      state.adminDashboardSummary = {
        data: null,
        isError: false,
        isSuccess: false,
        isLoading: false,
        message: "",
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminDashboardSummary.pending, (state) => {
        state.adminDashboardSummary.isLoading = true;
        state.adminDashboardSummary.message = "";
        state.adminDashboardSummary.isError = false;
        state.adminDashboardSummary.isSuccess = false;
        state.adminDashboardSummary.data = null;
      })
      .addCase(fetchAdminDashboardSummary.fulfilled, (state, action) => {
        state.adminDashboardSummary.isLoading = false;
        state.adminDashboardSummary.isSuccess = true;
        state.adminDashboardSummary.isError = false;
        state.adminDashboardSummary.data = action.payload;
      })
      .addCase(fetchAdminDashboardSummary.rejected, (state, action) => {
        state.adminDashboardSummary.message =
          action.payload?.message ?? action.payload?.data?.message ?? "Request failed";
        state.adminDashboardSummary.isLoading = false;
        state.adminDashboardSummary.isError = true;
        state.adminDashboardSummary.data = null;
      })
      .addCase(fetchAllUserWaitinglist.pending, (state) => {
        state.fetchAllUserWaitinglist.isLoading = true;
        state.fetchAllUserWaitinglist.message = "";
        state.fetchAllUserWaitinglist.isError = false;
        state.fetchAllUserWaitinglist.isSuccess = false;
        state.fetchAllUserWaitinglist.data = null;
      })
      .addCase(fetchAllUserWaitinglist.fulfilled, (state, action) => {
        state.fetchAllUserWaitinglist.isLoading = false;
        state.fetchAllUserWaitinglist.isSuccess = true;
        state.fetchAllUserWaitinglist.data = action.payload;
      })
      .addCase(fetchAllUserWaitinglist.rejected, (state, action) => {
        state.fetchAllUserWaitinglist.message = action.payload.message;
        state.fetchAllUserWaitinglist.isLoading = false;
        state.fetchAllUserWaitinglist.isError = true;
        state.fetchAllUserWaitinglist.data = null;
      });
  },
});

const emptyAdminDashboardSummary = {
  data: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

export const selectAdminDashboardSummary = (state) =>
  state.dashboard?.adminDashboardSummary ?? emptyAdminDashboardSummary;

export default dashboardSlice.reducer;
