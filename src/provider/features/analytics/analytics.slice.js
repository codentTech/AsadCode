import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import analyticsService from "../../../common/services/analytics.service";

// Async thunks
export const fetchPlatformAnalytics = createAsyncThunk(
  "analytics/fetchPlatformAnalytics",
  async (platform, { rejectWithValue }) => {
    try {
      const response = await analyticsService.getPlatformAnalytics(platform);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch analytics");
    }
  }
);

export const fetchAllPlatformsAnalytics = createAsyncThunk(
  "analytics/fetchAllPlatformsAnalytics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await analyticsService.getAllPlatformsAnalytics();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch all platforms analytics"
      );
    }
  }
);

export const fetchCombinedAnalyticsSummary = createAsyncThunk(
  "analytics/fetchCombinedAnalyticsSummary",
  async (_, { rejectWithValue }) => {
    try {
      const response = await analyticsService.getCombinedAnalyticsSummary();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch combined analytics");
    }
  }
);

// Initial state
const initialState = {
  platformAnalytics: {},
  allPlatformsAnalytics: [],
  combinedSummary: null,
  isLoading: false,
  isError: false,
  message: "",
  currentPlatform: null,
};

// Analytics slice
const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    clearAnalytics: (state) => {
      state.platformAnalytics = {};
      state.allPlatformsAnalytics = [];
      state.combinedSummary = null;
      state.isError = false;
      state.message = "";
    },
    setCurrentPlatform: (state, action) => {
      state.currentPlatform = action.payload;
    },
    clearErrors: (state) => {
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Platform Analytics
      .addCase(fetchPlatformAnalytics.pending, (state, action) => {
        state.isLoading = true;
        state.isError = false;
        state.currentPlatform = action.meta.arg;
      })
      .addCase(fetchPlatformAnalytics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        if (action.payload?.success) {
          const platform = action.payload.data?.platform;
          if (platform) {
            state.platformAnalytics[platform] = action.payload.data;
          }
        }
      })
      .addCase(fetchPlatformAnalytics.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "Failed to fetch platform analytics";
      })

      // Fetch All Platforms Analytics
      .addCase(fetchAllPlatformsAnalytics.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchAllPlatformsAnalytics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.allPlatformsAnalytics = action.payload || [];
      })
      .addCase(fetchAllPlatformsAnalytics.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "Failed to fetch all platforms analytics";
      })

      // Fetch Combined Analytics Summary
      .addCase(fetchCombinedAnalyticsSummary.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchCombinedAnalyticsSummary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.combinedSummary = action.payload || null;
      })
      .addCase(fetchCombinedAnalyticsSummary.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "Failed to fetch combined analytics";
      });
  },
});

export const { clearAnalytics, setCurrentPlatform, clearErrors } = analyticsSlice.actions;
export default analyticsSlice.reducer;
