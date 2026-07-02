import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import campaignReviewsService from "./campaign-reviews.service";

const generalState = {
  data: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

const initialState = {
  createCampaignReview: { ...generalState },
  getCampaignReviews: { ...generalState },
  getCampaignReviewsByCreator: { ...generalState },
  getCampaignReviewsByCreatorProfile: { ...generalState },
  updateCampaignReview: { ...generalState },
  deleteCampaignReview: { ...generalState },
  getReviewStatus: { ...generalState },
};

// Create campaign review
export const createCampaignReview = createAsyncThunk(
  "campaignReviews/createCampaignReview",
  async ({ campaignId, creatorProfileId, reviewData }, thunkAPI) => {
    try {
      const response = await campaignReviewsService.createCampaignReview(campaignId, {
        ...reviewData,
        creator_profile_id: creatorProfileId,
      });
      if (response.success) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Get campaign reviews
export const getCampaignReviews = createAsyncThunk(
  "campaignReviews/getCampaignReviews",
  async ({ campaignId, params = {} }, thunkAPI) => {
    try {
      const response = await campaignReviewsService.getCampaignReviews(campaignId, params);
      if (response.success) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Get all unlocked brand reviews for a creator (portfolio)
export const getCampaignReviewsByCreator = createAsyncThunk(
  "campaignReviews/getCampaignReviewsByCreator",
  async (creatorId, thunkAPI) => {
    try {
      const response = await campaignReviewsService.getCampaignReviewsByCreator(creatorId);
      if (response?.success && Array.isArray(response.data)) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error);
    }
  }
);

// Get campaign reviews by creator profile
export const getCampaignReviewsByCreatorProfile = createAsyncThunk(
  "campaignReviews/getCampaignReviewsByCreatorProfile",
  async ({ campaignId, creatorProfileId }, thunkAPI) => {
    try {
      const response = await campaignReviewsService.getCampaignReviewsByCreatorProfile(
        campaignId,
        creatorProfileId
      );
      if (response.success) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Double-blind review status
export const getReviewStatus = createAsyncThunk(
  "campaignReviews/getReviewStatus",
  async ({ campaignId, creatorProfileId }, thunkAPI) => {
    try {
      const response = await campaignReviewsService.getReviewStatus(campaignId, creatorProfileId);
      if (response.success) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message || "Failed to fetch review status",
      });
    }
  }
);

// Update campaign review
export const updateCampaignReview = createAsyncThunk(
  "campaignReviews/updateCampaignReview",
  async ({ reviewId, reviewData }, thunkAPI) => {
    try {
      const response = await campaignReviewsService.updateCampaignReview(reviewId, reviewData);
      if (response.success) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Delete campaign review
export const deleteCampaignReview = createAsyncThunk(
  "campaignReviews/deleteCampaignReview",
  async (reviewId, thunkAPI) => {
    try {
      const response = await campaignReviewsService.deleteCampaignReview(reviewId);
      if (response.success) {
        return { reviewId, message: response.message };
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const campaignReviewsSlice = createSlice({
  name: "campaignReviews",
  initialState,
  reducers: {
    reset: (state) => {
      state.createCampaignReview = { ...generalState };
      state.getCampaignReviews = { ...generalState };
      state.getCampaignReviewsByCreator = { ...generalState };
      state.getCampaignReviewsByCreatorProfile = { ...generalState };
      state.updateCampaignReview = { ...generalState };
      state.deleteCampaignReview = { ...generalState };
    },
    resetCreateCampaignReview: (state) => {
      state.createCampaignReview = { ...generalState };
    },
    resetUpdateCampaignReview: (state) => {
      state.updateCampaignReview = { ...generalState };
    },
    resetDeleteCampaignReview: (state) => {
      state.deleteCampaignReview = { ...generalState };
    },
  },
  extraReducers: (builder) => {
    builder
      // createCampaignReview
      .addCase(createCampaignReview.pending, (state) => {
        state.createCampaignReview.isLoading = true;
        state.createCampaignReview.isError = false;
        state.createCampaignReview.isSuccess = false;
      })
      .addCase(createCampaignReview.fulfilled, (state, action) => {
        state.createCampaignReview.isLoading = false;
        state.createCampaignReview.isSuccess = true;
        state.createCampaignReview.data = action.payload;
        state.createCampaignReview.message = "Review created successfully";
      })
      .addCase(createCampaignReview.rejected, (state, action) => {
        state.createCampaignReview.isLoading = false;
        state.createCampaignReview.isError = true;
        state.createCampaignReview.message = action.payload?.message || "Failed to create review";
      })

      // getCampaignReviews
      .addCase(getCampaignReviews.pending, (state) => {
        state.getCampaignReviews.isLoading = true;
        state.getCampaignReviews.isError = false;
        state.getCampaignReviews.isSuccess = false;
      })
      .addCase(getCampaignReviews.fulfilled, (state, action) => {
        state.getCampaignReviews.isLoading = false;
        state.getCampaignReviews.isSuccess = true;
        state.getCampaignReviews.data = action.payload;
      })
      .addCase(getCampaignReviews.rejected, (state, action) => {
        state.getCampaignReviews.isLoading = false;
        state.getCampaignReviews.isError = true;
        state.getCampaignReviews.message = action.payload?.message || "Failed to fetch reviews";
      })

      // getCampaignReviewsByCreator
      .addCase(getCampaignReviewsByCreator.pending, (state) => {
        state.getCampaignReviewsByCreator.isLoading = true;
        state.getCampaignReviewsByCreator.isError = false;
        state.getCampaignReviewsByCreator.isSuccess = false;
      })
      .addCase(getCampaignReviewsByCreator.fulfilled, (state, action) => {
        state.getCampaignReviewsByCreator.isLoading = false;
        state.getCampaignReviewsByCreator.isSuccess = true;
        state.getCampaignReviewsByCreator.data = action.payload;
      })
      .addCase(getCampaignReviewsByCreator.rejected, (state, action) => {
        state.getCampaignReviewsByCreator.isLoading = false;
        state.getCampaignReviewsByCreator.isError = true;
        state.getCampaignReviewsByCreator.message =
          action.payload?.message || "Failed to fetch reviews";
      })

      // getCampaignReviewsByCreatorProfile
      .addCase(getCampaignReviewsByCreatorProfile.pending, (state) => {
        state.getCampaignReviewsByCreatorProfile.isLoading = true;
        state.getCampaignReviewsByCreatorProfile.isError = false;
        state.getCampaignReviewsByCreatorProfile.isSuccess = false;
      })
      .addCase(getCampaignReviewsByCreatorProfile.fulfilled, (state, action) => {
        state.getCampaignReviewsByCreatorProfile.isLoading = false;
        state.getCampaignReviewsByCreatorProfile.isSuccess = true;
        state.getCampaignReviewsByCreatorProfile.data = action.payload;
      })
      .addCase(getCampaignReviewsByCreatorProfile.rejected, (state, action) => {
        state.getCampaignReviewsByCreatorProfile.isLoading = false;
        state.getCampaignReviewsByCreatorProfile.isError = true;
        state.getCampaignReviewsByCreatorProfile.message =
          action.payload?.message || "Failed to fetch reviews";
      })

      // getReviewStatus
      .addCase(getReviewStatus.pending, (state) => {
        state.getReviewStatus.isLoading = true;
        state.getReviewStatus.isError = false;
        state.getReviewStatus.isSuccess = false;
      })
      .addCase(getReviewStatus.fulfilled, (state, action) => {
        state.getReviewStatus.isLoading = false;
        state.getReviewStatus.isSuccess = true;
        state.getReviewStatus.data = action.payload;
      })
      .addCase(getReviewStatus.rejected, (state, action) => {
        state.getReviewStatus.isLoading = false;
        state.getReviewStatus.isError = true;
        state.getReviewStatus.message = action.payload?.message || "Failed to fetch review status";
      })

      // updateCampaignReview
      .addCase(updateCampaignReview.pending, (state) => {
        state.updateCampaignReview.isLoading = true;
        state.updateCampaignReview.isError = false;
        state.updateCampaignReview.isSuccess = false;
      })
      .addCase(updateCampaignReview.fulfilled, (state, action) => {
        state.updateCampaignReview.isLoading = false;
        state.updateCampaignReview.isSuccess = true;
        state.updateCampaignReview.data = action.payload;
        state.updateCampaignReview.message = "Review updated successfully";
      })
      .addCase(updateCampaignReview.rejected, (state, action) => {
        state.updateCampaignReview.isLoading = false;
        state.updateCampaignReview.isError = true;
        state.updateCampaignReview.message = action.payload?.message || "Failed to update review";
      })

      // deleteCampaignReview
      .addCase(deleteCampaignReview.pending, (state) => {
        state.deleteCampaignReview.isLoading = true;
        state.deleteCampaignReview.isError = false;
        state.deleteCampaignReview.isSuccess = false;
      })
      .addCase(deleteCampaignReview.fulfilled, (state, action) => {
        state.deleteCampaignReview.isLoading = false;
        state.deleteCampaignReview.isSuccess = true;
        state.deleteCampaignReview.data = action.payload;
        state.deleteCampaignReview.message = action.payload.message;
      })
      .addCase(deleteCampaignReview.rejected, (state, action) => {
        state.deleteCampaignReview.isLoading = false;
        state.deleteCampaignReview.isError = true;
        state.deleteCampaignReview.message = action.payload?.message || "Failed to delete review";
      });
  },
});

export const {
  reset,
  resetCreateCampaignReview,
  resetUpdateCampaignReview,
  resetDeleteCampaignReview,
} = campaignReviewsSlice.actions;

export default campaignReviewsSlice.reducer;
