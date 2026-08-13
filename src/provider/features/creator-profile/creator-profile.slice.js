import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import creatorProfileService from "./creator-profile.service";

const normalizeApiMessage = (value) => {
  if (value == null || value === "") return "";
  if (Array.isArray(value)) {
    const first = value.find((x) => x != null && String(x).trim() !== "");
    if (first != null) return String(first);
    return value.filter(Boolean).join(" ");
  }
  return String(value);
};

const rejectStateMessage = (payload) => {
  if (payload == null) return "Request failed";
  if (typeof payload.message === "string" || Array.isArray(payload.message)) {
    return normalizeApiMessage(payload.message) || "Request failed";
  }
  const err = payload.payload;
  if (err?.response?.data?.message != null) {
    return normalizeApiMessage(err.response.data.message) || "Request failed";
  }
  if (err?.message) return normalizeApiMessage(err.message) || "Request failed";
  return "Request failed";
};

const generalState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
  data: null,
};

const initialState = {
  setupCreatorProfile: generalState,
  updateCampaignPreferences: generalState,
  completeConnectSocial: generalState,
  getCreatorById: generalState,
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

export const completeCreatorConnectSocial = createAsyncThunk(
  "creator-profile/connect-social",
  async ({ payload, email }, thunkAPI) => {
    try {
      const response = await creatorProfileService.completeCreatorConnectSocial(payload, email);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const getCreatorById = createAsyncThunk(
  "creator-profile/getById",
  async (creatorId, thunkAPI) => {
    try {
      const response = await creatorProfileService.getCreatorById(creatorId);
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
      state.completeConnectSocial = generalState;
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
        state.setupCreatorProfile.message = rejectStateMessage(action.payload);
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
          message: rejectStateMessage(action.payload),
        };
      })
      .addCase(completeCreatorConnectSocial.pending, (state) => {
        state.completeConnectSocial = { ...generalState, isLoading: true };
      })
      .addCase(completeCreatorConnectSocial.fulfilled, (state, action) => {
        state.completeConnectSocial = {
          ...generalState,
          isSuccess: true,
          data: action.payload,
        };
      })
      .addCase(completeCreatorConnectSocial.rejected, (state, action) => {
        state.completeConnectSocial = {
          ...generalState,
          isError: true,
          message: rejectStateMessage(action.payload),
        };
      })
      .addCase(getCreatorById.pending, (state) => {
        state.getCreatorById.isLoading = true;
      })
      .addCase(getCreatorById.fulfilled, (state, action) => {
        state.getCreatorById.isLoading = false;
        state.getCreatorById.isSuccess = true;
        state.getCreatorById.data = action.payload;
      })
      .addCase(getCreatorById.rejected, (state, action) => {
        state.getCreatorById.isLoading = false;
        state.getCreatorById.isError = true;
        state.getCreatorById.message = rejectStateMessage(action.payload);
      });
  },
});

export const { reset } = creatorProfileSlice.actions;
export default creatorProfileSlice.reducer;
