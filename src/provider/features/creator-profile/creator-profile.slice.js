import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import creatorProfileService from "./creator-profile.service";

const generalState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
  data: null,
};

const initialState = {
  setupCreatorProfile: generalState,
};

export const setupCreatorProfile = createAsyncThunk(
  "creator-profile/setup",
  async ({ payload, email }, thunkAPI) => {
    try {
      const response = await creatorProfileService.setupCreatorProfile(payload, email);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const setupCreatorCampaignPreferences = createAsyncThunk(
  "creator-profile/campaign-preferences",
  async ({ payload, email }, thunkAPI) => {
    try {
      const response = await creatorProfileService.setupCreatorCampaignPreferences(payload, email);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const creatorProfileSlice = createSlice({
  name: "creator-profile",
  initialState,
  reducers: {
    reset: (state) => {
      state.setupCreatorProfile = generalState;
      state.updateCampaignPreferences = generalState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setupCreatorProfile.pending, (state) => {
        state.setupCreatorProfile.isLoading = true;
      })
      .addCase(setupCreatorProfile.fulfilled, (state, action) => {
        state.setupCreatorProfile.isLoading = false;
        state.setupCreatorProfile.isSuccess = true;
        state.setupCreatorProfile.data = action.payload;
      })
      .addCase(setupCreatorProfile.rejected, (state, action) => {
        state.setupCreatorProfile.isLoading = false;
        state.setupCreatorProfile.isError = true;
        state.setupCreatorProfile.message = action.payload.message;
      })
      .addCase(setupCreatorCampaignPreferences.pending, (state) => {
        state.updateCampaignPreferences = { ...generalState, isLoading: true };
      })
      .addCase(setupCreatorCampaignPreferences.fulfilled, (state, action) => {
        state.updateCampaignPreferences = {
          ...generalState,
          isSuccess: true,
          data: action.payload,
        };
      })
      .addCase(setupCreatorCampaignPreferences.rejected, (state, action) => {
        state.updateCampaignPreferences = {
          ...generalState,
          isError: true,
          message: action.payload.message,
        };
      });
  },
});

export const { reset } = creatorProfileSlice.actions;
export default creatorProfileSlice.reducer;
