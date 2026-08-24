import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import campaignReportService from "./campaign-report.service";

const getSerializableError = (error) => {
  if (!error) return { message: "Something went wrong" };
  if (typeof error === "string") return { message: error };
  return {
    message: error.message || error.error || "Something went wrong",
    statusCode: error.statusCode || error.status,
  };
};

const generalState = {
  data: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

const initialState = {
  getCompletedReport: { ...generalState },
};

export const getCompletedCampaignReport = createAsyncThunk(
  "campaignReport/getCompletedReport",
  async (campaignId, thunkAPI) => {
    try {
      const response = await campaignReportService.getCompletedCampaignReport(campaignId);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      if (thunkAPI.signal.aborted) {
        // Let RTK mark this as aborted (do not surface as a user-facing error).
        throw error;
      }
      return thunkAPI.rejectWithValue(getSerializableError(error));
    }
  }
);

const campaignReportSlice = createSlice({
  name: "campaignReport",
  initialState,
  reducers: {
    resetCompletedReport: (state) => {
      state.getCompletedReport = { ...generalState };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCompletedCampaignReport.pending, (state) => {
        state.getCompletedReport.isLoading = true;
        state.getCompletedReport.isError = false;
        state.getCompletedReport.isSuccess = false;
        state.getCompletedReport.message = "";
        state.getCompletedReport.data = null;
      })
      .addCase(getCompletedCampaignReport.fulfilled, (state, action) => {
        state.getCompletedReport = {
          isLoading: false,
          isSuccess: true,
          isError: false,
          message: "",
          data: action.payload.data,
        };
      })
      .addCase(getCompletedCampaignReport.rejected, (state, action) => {
        // Ignore aborted requests (React Strict Mode remount / navigation) so they
        // cannot overwrite a newer in-flight or successful fetch.
        if (action.meta?.aborted || action.meta?.condition) return;
        state.getCompletedReport = {
          isLoading: false,
          isSuccess: false,
          isError: true,
          message: action.payload?.message || "Failed to load report",
          data: null,
        };
      });
  },
});

export const { resetCompletedReport } = campaignReportSlice.actions;
export const selectCompletedCampaignReport = (state) =>
  state.campaignReport?.getCompletedReport ?? generalState;

export default campaignReportSlice.reducer;
