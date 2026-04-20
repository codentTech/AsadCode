import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import phylloService from "./phyllo.service";

const getSerializableError = (error, defaultMessage) => ({
  message: error.response?.data?.message || error.message || defaultMessage,
});

const generalState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
  data: null,
};

const performanceMetricsInitialState = { ...generalState, campaignId: null };
const combinedDemographicsInitialState = { ...generalState, campaignId: null, creatorId: null };

const initialState = {
  fetchCreatorStats: { ...generalState },
  fetchCreatorAudience: { ...generalState },
  fetchCreatorSocialAccounts: { ...generalState },
  fetchCampaignCombinedDemographics: { ...combinedDemographicsInitialState },
  fetchCampaignPerformanceMetrics: { ...performanceMetricsInitialState },
  fetchCreatorMetrics: { ...generalState },
};

// === Async thunks ===
export const fetchCreatorStats = createAsyncThunk(
  "phyllo/fetchCreatorStats",
  async (payload, thunkAPI) => {
    try {
      const creatorId = typeof payload === "object" ? payload?.creatorId : payload;
      const platform = typeof payload === "object" ? payload?.platform : undefined;
      const response = await phylloService.fetchCreatorStats(creatorId, platform);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error, "Failed to fetch stats"));
    }
  }
);

export const fetchCreatorAudience = createAsyncThunk(
  "phyllo/fetchCreatorAudience",
  async (payload, thunkAPI) => {
    try {
      const creatorId = typeof payload === "object" ? payload?.creatorId : payload;
      const platform = typeof payload === "object" ? payload?.platform : undefined;
      const response = await phylloService.fetchCreatorAudience(creatorId, platform);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error, "Failed to fetch audience"));
    }
  }
);

export const fetchCreatorSocialAccounts = createAsyncThunk(
  "phyllo/fetchCreatorSocialAccounts",
  async (payload, thunkAPI) => {
    try {
      const creatorId = typeof payload === "object" ? payload?.creatorId : payload;
      const platform = typeof payload === "object" ? payload?.platform : undefined;
      const response = await phylloService.fetchCreatorSocialAccounts(creatorId, platform);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getSerializableError(error, "Failed to fetch social accounts")
      );
    }
  }
);

export const fetchCampaignCombinedDemographics = createAsyncThunk(
  "phyllo/fetchCampaignCombinedDemographics",
  async (payload, thunkAPI) => {
    try {
      const campaignId =
        typeof payload === "object" && payload != null ? payload.campaignId : payload;
      const creatorId =
        typeof payload === "object" && payload != null ? payload.creatorId : undefined;
      const response = await phylloService.fetchCampaignCombinedDemographics(
        campaignId,
        creatorId || null
      );
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getSerializableError(error, "Failed to fetch campaign combined demographics")
      );
    }
  }
);

export const fetchCampaignPerformanceMetrics = createAsyncThunk(
  "phyllo/fetchCampaignPerformanceMetrics",
  async (campaignId, thunkAPI) => {
    try {
      const response = await phylloService.fetchCampaignPerformanceMetrics(campaignId);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getSerializableError(error, "Failed to fetch campaign performance metrics")
      );
    }
  }
);

export const fetchCreatorMetrics = createAsyncThunk(
  "phyllo/fetchCreatorMetrics",
  async (payload, thunkAPI) => {
    try {
      const creatorId = typeof payload === "object" ? payload?.creatorId : payload;
      const platform = typeof payload === "object" ? payload?.platform : undefined;
      const response = await phylloService.fetchCreatorMetrics(creatorId, platform);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getSerializableError(error, "Failed to fetch creator metrics")
      );
    }
  }
);

// === Slice ===
export const phylloSlice = createSlice({
  name: "phyllo",
  initialState,
  reducers: {
    reset: (state) => {
      state.fetchCreatorStats = { ...generalState };
      state.fetchCreatorAudience = { ...generalState };
      state.fetchCreatorSocialAccounts = { ...generalState };
      state.fetchCampaignCombinedDemographics = { ...combinedDemographicsInitialState };
      state.fetchCampaignPerformanceMetrics = { ...performanceMetricsInitialState };
      state.fetchCreatorMetrics = { ...generalState };
    },
    resetAudience: (state) => {
      state.fetchCreatorAudience = { ...generalState };
    },
    resetCampaignDemographics: (state) => {
      state.fetchCampaignCombinedDemographics = {
        ...combinedDemographicsInitialState,
      };
    },
    resetPerformanceMetrics: (state) => {
      state.fetchCampaignPerformanceMetrics = { ...performanceMetricsInitialState };
    },
    resetMetrics: (state) => {
      state.fetchCreatorMetrics = { ...generalState };
    },
  },
  extraReducers: (builder) => {
    // Stats
    builder
      .addCase(fetchCreatorStats.pending, (state, action) => {
        state.fetchCreatorStats = {
          ...generalState,
          isLoading: true,
          requestId: action.meta.requestId,
        };
      })
      .addCase(fetchCreatorStats.fulfilled, (state, action) => {
        if (state.fetchCreatorStats.requestId !== action.meta.requestId) {
          return;
        }
        state.fetchCreatorStats.isLoading = false;
        state.fetchCreatorStats.isSuccess = true;
        state.fetchCreatorStats.data = action.payload.data; // keep only data
      })
      .addCase(fetchCreatorStats.rejected, (state, action) => {
        if (state.fetchCreatorStats.requestId !== action.meta.requestId) {
          return;
        }
        state.fetchCreatorStats.isLoading = false;
        state.fetchCreatorStats.isError = true;
        state.fetchCreatorStats.message = action.payload?.message || "Failed to fetch stats";
      });

    // Audience
    builder
      .addCase(fetchCreatorAudience.pending, (state, action) => {
        state.fetchCreatorAudience = {
          ...generalState,
          isLoading: true,
          requestId: action.meta.requestId,
        };
      })
      .addCase(fetchCreatorAudience.fulfilled, (state, action) => {
        if (state.fetchCreatorAudience.requestId !== action.meta.requestId) {
          return;
        }
        state.fetchCreatorAudience.isLoading = false;
        state.fetchCreatorAudience.isSuccess = true;
        state.fetchCreatorAudience.data = action.payload.data;
      })
      .addCase(fetchCreatorAudience.rejected, (state, action) => {
        if (state.fetchCreatorAudience.requestId !== action.meta.requestId) {
          return;
        }
        state.fetchCreatorAudience.isLoading = false;
        state.fetchCreatorAudience.isError = true;
        state.fetchCreatorAudience.message = action.payload?.message || "Failed to fetch audience";
      });

    // Social accounts
    builder
      .addCase(fetchCreatorSocialAccounts.pending, (state, action) => {
        state.fetchCreatorSocialAccounts = {
          ...generalState,
          isLoading: true,
          requestId: action.meta.requestId,
        };
      })
      .addCase(fetchCreatorSocialAccounts.fulfilled, (state, action) => {
        if (state.fetchCreatorSocialAccounts.requestId !== action.meta.requestId) {
          return;
        }
        state.fetchCreatorSocialAccounts.isLoading = false;
        state.fetchCreatorSocialAccounts.isSuccess = true;
        state.fetchCreatorSocialAccounts.data = action.payload.data;
      })
      .addCase(fetchCreatorSocialAccounts.rejected, (state, action) => {
        if (state.fetchCreatorSocialAccounts.requestId !== action.meta.requestId) {
          return;
        }
        state.fetchCreatorSocialAccounts.isLoading = false;
        state.fetchCreatorSocialAccounts.isError = true;
        state.fetchCreatorSocialAccounts.message =
          action.payload?.message || "Failed to fetch social accounts";
      });

    // Campaign Combined Demographics
    builder
      .addCase(fetchCampaignCombinedDemographics.pending, (state, action) => {
        const arg = action.meta?.arg;
        const requestedCampaignId =
          typeof arg === "object" && arg != null ? arg.campaignId : arg;
        const requestedCreatorId =
          typeof arg === "object" && arg != null ? arg.creatorId ?? null : null;
        if (
          requestedCampaignId !== state.fetchCampaignCombinedDemographics.campaignId ||
          (requestedCreatorId ?? null) !== (state.fetchCampaignCombinedDemographics.creatorId ?? null)
        ) {
          state.fetchCampaignCombinedDemographics.data = null;
          state.fetchCampaignCombinedDemographics.campaignId = null;
          state.fetchCampaignCombinedDemographics.creatorId = null;
        }
        state.fetchCampaignCombinedDemographics.isLoading = true;
      })
      .addCase(fetchCampaignCombinedDemographics.fulfilled, (state, action) => {
        state.fetchCampaignCombinedDemographics.isLoading = false;
        state.fetchCampaignCombinedDemographics.isSuccess = true;
        const arg = action.meta?.arg;
        const campaignId = typeof arg === "object" && arg != null ? arg.campaignId : arg;
        const creatorId = typeof arg === "object" && arg != null ? arg.creatorId ?? null : null;
        const newData = action.payload?.data;
        const currentData = state.fetchCampaignCombinedDemographics.data;
        const currentCampaignId = state.fetchCampaignCombinedDemographics.campaignId;
        const currentCreatorId = state.fetchCampaignCombinedDemographics.creatorId;

        const newHasAge =
          Array.isArray(newData?.audience_age_distribution) &&
          newData.audience_age_distribution.length > 0;
        const newHasCountry =
          Array.isArray(newData?.audience_country_distribution) &&
          newData.audience_country_distribution.length > 0;
        const currentHasAge =
          Array.isArray(currentData?.audience_age_distribution) &&
          currentData.audience_age_distribution.length > 0;
        const currentHasCountry =
          Array.isArray(currentData?.audience_country_distribution) &&
          currentData.audience_country_distribution.length > 0;

        const isSameContext =
          campaignId === currentCampaignId && (creatorId ?? null) === (currentCreatorId ?? null);
        const keepCurrent =
          isSameContext && (currentHasAge || currentHasCountry) && !newHasAge && !newHasCountry;

        if (keepCurrent) {
          return;
        }

        state.fetchCampaignCombinedDemographics.data = newData;
        state.fetchCampaignCombinedDemographics.campaignId = campaignId;
        state.fetchCampaignCombinedDemographics.creatorId = creatorId;
      })
      .addCase(fetchCampaignCombinedDemographics.rejected, (state, action) => {
        state.fetchCampaignCombinedDemographics.isLoading = false;
        state.fetchCampaignCombinedDemographics.isError = true;
        state.fetchCampaignCombinedDemographics.message =
          action.payload?.message || "Failed to fetch campaign combined demographics";
      });

    // Campaign Performance Metrics
    builder
      .addCase(fetchCampaignPerformanceMetrics.pending, (state, action) => {
        const requestedCampaignId = action.meta?.arg;
        if (requestedCampaignId !== state.fetchCampaignPerformanceMetrics.campaignId) {
          state.fetchCampaignPerformanceMetrics.data = null;
          state.fetchCampaignPerformanceMetrics.campaignId = null;
        }
        state.fetchCampaignPerformanceMetrics.isLoading = true;
      })
      .addCase(fetchCampaignPerformanceMetrics.fulfilled, (state, action) => {
        state.fetchCampaignPerformanceMetrics.isLoading = false;
        state.fetchCampaignPerformanceMetrics.isSuccess = true;
        const campaignId = action.meta?.arg;
        const newData = action.payload?.data;
        const currentData = state.fetchCampaignPerformanceMetrics.data;
        const currentCampaignId = state.fetchCampaignPerformanceMetrics.campaignId;

        const isNewDataZeros =
          newData &&
          newData.totalViews === 0 &&
          newData.totalEngagement === 0 &&
          (newData.creators_with_data === 0 ||
            Object.keys(newData.creator_breakdown || {}).length === 0);

        const isSameCampaign = campaignId === currentCampaignId;
        const hasCurrentData =
          currentData && (currentData.totalViews > 0 || currentData.totalEngagement > 0);

        if (isSameCampaign && hasCurrentData && isNewDataZeros) {
          return;
        }

        state.fetchCampaignPerformanceMetrics.data = newData;
        state.fetchCampaignPerformanceMetrics.campaignId = campaignId;
      })
      .addCase(fetchCampaignPerformanceMetrics.rejected, (state, action) => {
        state.fetchCampaignPerformanceMetrics.isLoading = false;
        state.fetchCampaignPerformanceMetrics.isError = true;
        state.fetchCampaignPerformanceMetrics.message =
          action.payload?.message || "Failed to fetch campaign performance metrics";
      })

      // ===== CREATOR METRICS =====
      .addCase(fetchCreatorMetrics.pending, (state, action) => {
        state.fetchCreatorMetrics = {
          ...generalState,
          isLoading: true,
          requestId: action.meta.requestId,
        };
      })
      .addCase(fetchCreatorMetrics.fulfilled, (state, action) => {
        if (state.fetchCreatorMetrics.requestId !== action.meta.requestId) {
          return;
        }
        state.fetchCreatorMetrics.isLoading = false;
        state.fetchCreatorMetrics.isSuccess = true;
        state.fetchCreatorMetrics.data = action.payload;
      })
      .addCase(fetchCreatorMetrics.rejected, (state, action) => {
        if (state.fetchCreatorMetrics.requestId !== action.meta.requestId) {
          return;
        }
        state.fetchCreatorMetrics.isLoading = false;
        state.fetchCreatorMetrics.isError = true;
        state.fetchCreatorMetrics.message =
          action.payload?.message || "Failed to fetch creator metrics";
      });
  },
});

// === Selectors (keep old names) - with safe fallbacks ===
export const selectCreatorStats = (state) => state.phyllo?.fetchCreatorStats || { ...generalState };
export const selectCreatorAudience = (state) =>
  state.phyllo?.fetchCreatorAudience || { ...generalState };
export const selectCreatorSocialAccounts = (state) =>
  state.phyllo?.fetchCreatorSocialAccounts || { ...generalState };
export const selectCampaignCombinedDemographics = (state) =>
  state.phyllo?.fetchCampaignCombinedDemographics || { ...generalState };
export const selectCampaignPerformanceMetrics = (state) =>
  state.phyllo?.fetchCampaignPerformanceMetrics || { ...generalState };

// ===== CREATOR METRICS =====
export const selectCreatorMetrics = (state) =>
  state.phyllo?.fetchCreatorMetrics || { ...generalState };

// === Exports ===
export const {
  reset,
  resetAudience,
  resetCampaignDemographics,
  resetPerformanceMetrics,
  resetMetrics,
} = phylloSlice.actions;
export default phylloSlice.reducer;
