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

const initialState = {
  fetchCreatorStats: { ...generalState },
  fetchCreatorAudience: { ...generalState },
  fetchCreatorSocialAccounts: { ...generalState },
};

// === Async thunks ===
export const fetchCreatorStats = createAsyncThunk(
  "phyllo/fetchCreatorStats",
  async (creatorId, thunkAPI) => {
    try {
      const response = await phylloService.fetchCreatorStats(creatorId);
      if (response.success) return response; // must have success
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error, "Failed to fetch stats"));
    }
  }
);

export const fetchCreatorAudience = createAsyncThunk(
  "phyllo/fetchCreatorAudience",
  async (creatorId, thunkAPI) => {
    try {
      const response = await phylloService.fetchCreatorAudience(creatorId);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error, "Failed to fetch audience"));
    }
  }
);

export const fetchCreatorSocialAccounts = createAsyncThunk(
  "phyllo/fetchCreatorSocialAccounts",
  async (creatorId, thunkAPI) => {
    try {
      const response = await phylloService.fetchCreatorSocialAccounts(creatorId);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getSerializableError(error, "Failed to fetch social accounts")
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
    },
  },
  extraReducers: (builder) => {
    // Stats
    builder
      .addCase(fetchCreatorStats.pending, (state) => {
        state.fetchCreatorStats = { ...generalState, isLoading: true };
      })
      .addCase(fetchCreatorStats.fulfilled, (state, action) => {
        state.fetchCreatorStats.isLoading = false;
        state.fetchCreatorStats.isSuccess = true;
        state.fetchCreatorStats.data = action.payload.data; // keep only data
      })
      .addCase(fetchCreatorStats.rejected, (state, action) => {
        state.fetchCreatorStats.isLoading = false;
        state.fetchCreatorStats.isError = true;
        state.fetchCreatorStats.message = action.payload?.message || "Failed to fetch stats";
      });

    // Audience
    builder
      .addCase(fetchCreatorAudience.pending, (state) => {
        state.fetchCreatorAudience = { ...generalState, isLoading: true };
      })
      .addCase(fetchCreatorAudience.fulfilled, (state, action) => {
        state.fetchCreatorAudience.isLoading = false;
        state.fetchCreatorAudience.isSuccess = true;
        state.fetchCreatorAudience.data = action.payload.data;
      })
      .addCase(fetchCreatorAudience.rejected, (state, action) => {
        state.fetchCreatorAudience.isLoading = false;
        state.fetchCreatorAudience.isError = true;
        state.fetchCreatorAudience.message = action.payload?.message || "Failed to fetch audience";
      });

    // Social accounts
    builder
      .addCase(fetchCreatorSocialAccounts.pending, (state) => {
        state.fetchCreatorSocialAccounts = { ...generalState, isLoading: true };
      })
      .addCase(fetchCreatorSocialAccounts.fulfilled, (state, action) => {
        state.fetchCreatorSocialAccounts.isLoading = false;
        state.fetchCreatorSocialAccounts.isSuccess = true;
        state.fetchCreatorSocialAccounts.data = action.payload.data;
      })
      .addCase(fetchCreatorSocialAccounts.rejected, (state, action) => {
        state.fetchCreatorSocialAccounts.isLoading = false;
        state.fetchCreatorSocialAccounts.isError = true;
        state.fetchCreatorSocialAccounts.message =
          action.payload?.message || "Failed to fetch social accounts";
      });
  },
});

// === Selectors (keep old names) ===
export const selectCreatorStats = (state) => state.phyllo.fetchCreatorStats;
export const selectCreatorAudience = (state) => state.phyllo.fetchCreatorAudience;
export const selectCreatorSocialAccounts = (state) => state.phyllo.fetchCreatorSocialAccounts;

// === Exports ===
export const { reset } = phylloSlice.actions;
export default phylloSlice.reducer;
