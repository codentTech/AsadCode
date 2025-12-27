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
  getBrandProfile: generalState,
};

export const setupBrandProfile = createAsyncThunk(
  "brand-profile/setup",
  async ({ payload, email }, thunkAPI) => {
    const response = await brandProfileService.setupBrandProfile(payload, email);
    if (response.success) return response;
    return thunkAPI.rejectWithValue({
      message: response.message || "Failed to setup brand profile",
      statusCode: response.statusCode || 400,
    });
  }
);

export const setupBrandCampaignPreferences = createAsyncThunk(
  "brand-profile/campaign-preferences",
  async ({ payload, email }, thunkAPI) => {
    const response = await brandProfileService.setupBrandCampaignPreferences(payload, email);
    if (response.success) return response;
    return thunkAPI.rejectWithValue({
      message: response.message || "Failed to setup campaign preferences",
      statusCode: response.statusCode || 400,
    });
  }
);

export const setupBrandIdealCreator = createAsyncThunk(
  "brand-profile/ideal-creator",
  async ({ payload, email }, thunkAPI) => {
    const response = await brandProfileService.setupBrandIdealCreator(payload, email);
    if (response.success) return response;
    return thunkAPI.rejectWithValue({
      message: response.message || "Failed to setup ideal creator",
      statusCode: response.statusCode || 400,
    });
  }
);

export const getBrandProfile = createAsyncThunk("brand-profile/get", async (email, thunkAPI) => {
  const response = await brandProfileService.getBrandProfile(email);
  if (response.success) return response;
  return thunkAPI.rejectWithValue({
    message: response.message || "Failed to fetch brand profile",
    statusCode: response.statusCode || 400,
  });
});

export const brandProfileSlice = createSlice({
  name: "brandProfile",
  initialState,
  reducers: {
    reset: (state) => {
      state.setupBrandProfile = generalState;
      state.updateCampaignPreferences = generalState;
      state.updateIdealCreator = generalState;
      state.getBrandProfile = generalState;
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
        state.setupBrandProfile.message =
          action.payload?.message || "Failed to setup brand profile";
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
          message: action.payload?.message || "Failed to setup campaign preferences",
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
          message: action.payload?.message || "Failed to setup ideal creator",
        };
      })
      .addCase(getBrandProfile.pending, (state) => {
        state.getBrandProfile.isLoading = true;
      })
      .addCase(getBrandProfile.fulfilled, (state, action) => {
        state.getBrandProfile.isLoading = false;
        state.getBrandProfile.isSuccess = true;
        state.getBrandProfile.data = action.payload;
      })
      .addCase(getBrandProfile.rejected, (state, action) => {
        state.getBrandProfile.isLoading = false;
        state.getBrandProfile.isError = true;
        state.getBrandProfile.message = action.payload?.message || "Failed to fetch brand profile";
      });
  },
});

export const { reset } = brandProfileSlice.actions;
export default brandProfileSlice.reducer;
