import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import brandProfileService from "./brand-profile.service";

const generalState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
  data: null,
};

const initialState = {
  setupBrandProfile: generalState,
};

export const setupBrandProfile = createAsyncThunk(
  "brand-profile/setup",
  async ({ payload, email }, thunkAPI) => {
    try {
      const response = await brandProfileService.setupBrandProfile(payload, email);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const setupBrandCampaignPreferences = createAsyncThunk(
  "brand-profile/campaign-preferences",
  async ({ payload, email }, thunkAPI) => {
    try {
      const response = await brandProfileService.setupBrandCampaignPreferences(payload, email);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const setupBrandIdealCreator = createAsyncThunk(
  "brand-profile/ideal-creator",
  async ({ payload, email }, thunkAPI) => {
    try {
      const response = await brandProfileService.setupBrandIdealCreator(payload, email);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const brandProfileSlice = createSlice({
  name: "brandProfile",
  initialState,
  reducers: {
    reset: (state) => {
      state.setupBrandProfile = generalState;
      state.updateCampaignPreferences = generalState;
      state.updateIdealCreator = generalState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setupBrandProfile.pending, (state) => {
        state.setupBrandProfile.isLoading = true;
      })
      .addCase(setupBrandProfile.fulfilled, (state, action) => {
        state.setupBrandProfile.isLoading = false;
        state.setupBrandProfile.isSuccess = true;
        state.setupBrandProfile.data = action.payload;
      })
      .addCase(setupBrandProfile.rejected, (state, action) => {
        state.setupBrandProfile.isLoading = false;
        state.setupBrandProfile.isError = true;
        state.setupBrandProfile.message = action.payload.message;
      })
      .addCase(setupBrandCampaignPreferences.pending, (state) => {
        state.updateCampaignPreferences = { ...generalState, isLoading: true };
      })
      .addCase(setupBrandCampaignPreferences.fulfilled, (state, action) => {
        state.updateCampaignPreferences = {
          ...generalState,
          isSuccess: true,
          data: action.payload,
        };
      })
      .addCase(setupBrandCampaignPreferences.rejected, (state, action) => {
        state.updateCampaignPreferences = {
          ...generalState,
          isError: true,
          message: action.payload.message,
        };
      })
      .addCase(setupBrandIdealCreator.pending, (state) => {
        state.updateIdealCreator = { ...generalState, isLoading: true };
      })
      .addCase(setupBrandIdealCreator.fulfilled, (state, action) => {
        state.updateIdealCreator = { ...generalState, isSuccess: true, data: action.payload };
      })
      .addCase(setupBrandIdealCreator.rejected, (state, action) => {
        state.updateIdealCreator = {
          ...generalState,
          isError: true,
          message: action.payload.message,
        };
      });
  },
});

export const { reset } = brandProfileSlice.actions;
export default brandProfileSlice.reducer;
