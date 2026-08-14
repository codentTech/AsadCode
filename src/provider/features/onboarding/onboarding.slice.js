import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import onboardingService from "./onboarding.service";

export const getOnboardingStatus = createAsyncThunk(
  "onboarding/getOnboardingStatus",
  async (email, thunkAPI) => {
    try {
      const response = await onboardingService.getOnboardingStatus(email);
      if (response.success) return response.data;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const initialState = {
  onboardingStatus: null,
  onboardingStatusLoading: false,
  onboardingStatusError: null,
};

const onboardingSlice = createSlice({
  name: "onboarding",
  initialState,
  reducers: {
    resetOnboardingSession: () => ({ ...initialState }),
    patchOnboardingCreatorProfile: (state, action) => {
      if (!state.onboardingStatus) {
        state.onboardingStatus = {
          user: null,
          creatorProfile: action.payload || null,
          brandProfile: null,
          isCompleted: false,
          onboardingStep: null,
          storedOnboardingStep: null,
          checklist: null,
        };
        return;
      }
      state.onboardingStatus.creatorProfile = {
        ...(state.onboardingStatus.creatorProfile || {}),
        ...(action.payload || {}),
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOnboardingStatus.pending, (state) => {
        state.onboardingStatusLoading = true;
        state.onboardingStatusError = null;
      })
      .addCase(getOnboardingStatus.fulfilled, (state, action) => {
        state.onboardingStatusLoading = false;
        state.onboardingStatus = action.payload;
      })
      .addCase(getOnboardingStatus.rejected, (state, action) => {
        state.onboardingStatusLoading = false;
        state.onboardingStatusError = action.payload;
      });
  },
});

export const { resetOnboardingSession, patchOnboardingCreatorProfile } = onboardingSlice.actions;

export default onboardingSlice.reducer;
