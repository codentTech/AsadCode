import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import adminAuditService from "./admin-audit.service";

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
  fetchAdminAuditLogs: { ...generalState },
};

export const fetchAdminAuditLogs = createAsyncThunk(
  "adminAudit/fetchLogs",
  async (params, thunkAPI) => {
    try {
      const response = await adminAuditService.getAdminAuditLogs(params);
      if (response.success) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error));
    }
  }
);

export const adminAuditSlice = createSlice({
  name: "adminAudit",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminAuditLogs.pending, (state) => {
        state.fetchAdminAuditLogs.isLoading = true;
        state.fetchAdminAuditLogs.message = "";
        state.fetchAdminAuditLogs.isError = false;
        state.fetchAdminAuditLogs.isSuccess = false;
        state.fetchAdminAuditLogs.data = null;
      })
      .addCase(fetchAdminAuditLogs.fulfilled, (state, action) => {
        state.fetchAdminAuditLogs.isLoading = false;
        state.fetchAdminAuditLogs.isSuccess = true;
        state.fetchAdminAuditLogs.isError = false;
        state.fetchAdminAuditLogs.data = action.payload;
      })
      .addCase(fetchAdminAuditLogs.rejected, (state, action) => {
        state.fetchAdminAuditLogs.message =
          action.payload?.message ?? action.payload?.data?.message ?? "Request failed";
        state.fetchAdminAuditLogs.isLoading = false;
        state.fetchAdminAuditLogs.isError = true;
        state.fetchAdminAuditLogs.data = null;
      });
  },
});

export const selectFetchAdminAuditLogs = (state) => state.adminAudit.fetchAdminAuditLogs;

export default adminAuditSlice.reducer;
