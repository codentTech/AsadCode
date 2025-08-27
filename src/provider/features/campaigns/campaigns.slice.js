import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import campaignsService from "./campaigns.service";

const generalState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
  data: null,
};

const initialState = {
  createCampaign: { ...generalState },
  getAllCampaigns: { ...generalState },
  getCampaignById: { ...generalState },
  updateCampaign: { ...generalState },
  deleteCampaign: { ...generalState },
  publishCampaign: { ...generalState },
  filterCampaigns: { ...generalState },
  getCampaignStats: { ...generalState },
};

// Create campaign
export const createCampaign = createAsyncThunk(
  "campaigns/createCampaign",
  async (payload, thunkAPI) => {
    try {
      const response = await campaignsService.createCampaign(payload);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

// Get all campaigns
export const getAllCampaigns = createAsyncThunk(
  "campaigns/getAllCampaigns",
  async (payload, thunkAPI) => {
    try {
      const response = await campaignsService.getAllCampaigns(payload);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

// Get campaign by ID
export const getCampaignById = createAsyncThunk(
  "campaigns/getCampaignById",
  async (campaignId, thunkAPI) => {
    try {
      const response = await campaignsService.getCampaignById(campaignId);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

// Update campaign
export const updateCampaign = createAsyncThunk(
  "campaigns/updateCampaign",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await campaignsService.updateCampaign(id, data);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

// Delete campaign
export const deleteCampaign = createAsyncThunk(
  "campaigns/deleteCampaign",
  async (campaignId, thunkAPI) => {
    try {
      const response = await campaignsService.deleteCampaign(campaignId);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

// Publish campaign
export const publishCampaign = createAsyncThunk(
  "campaigns/publishCampaign",
  async (campaignId, thunkAPI) => {
    try {
      const response = await campaignsService.publishCampaign(campaignId);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

// Filter campaigns
export const filterCampaigns = createAsyncThunk(
  "campaigns/filterCampaigns",
  async (filters, thunkAPI) => {
    try {
      const response = await campaignsService.filterCampaigns(filters);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

// Get campaign stats
export const getCampaignStats = createAsyncThunk(
  "campaigns/getCampaignStats",
  async (_, thunkAPI) => {
    try {
      const response = await campaignsService.getCampaignStats();
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const campaignsSlice = createSlice({
  name: "campaigns",
  initialState,
  reducers: {
    reset: (state) => {
      state.createCampaign = { ...generalState };
      state.getAllCampaigns = { ...generalState };
      state.getCampaignById = { ...generalState };
      state.updateCampaign = { ...generalState };
      state.deleteCampaign = { ...generalState };
      state.publishCampaign = { ...generalState };
      state.filterCampaigns = { ...generalState };
      state.getCampaignStats = { ...generalState };
    },
    resetCreateCampaign: (state) => {
      state.createCampaign = { ...generalState };
    },
    resetUpdateCampaign: (state) => {
      state.updateCampaign = { ...generalState };
    },
  },
  extraReducers: (builder) => {
    builder
      // createCampaign
      .addCase(createCampaign.pending, (state) => {
        state.createCampaign.isLoading = true;
        state.createCampaign.message = "";
        state.createCampaign.isError = false;
        state.createCampaign.isSuccess = false;
        state.createCampaign.data = null;
      })
      .addCase(createCampaign.fulfilled, (state, action) => {
        state.createCampaign.isLoading = false;
        state.createCampaign.isSuccess = true;
        state.createCampaign.data = action.payload;
      })
      .addCase(createCampaign.rejected, (state, action) => {
        state.createCampaign.message = action.payload?.message || "Failed to create campaign";
        state.createCampaign.isLoading = false;
        state.createCampaign.isError = true;
        state.createCampaign.data = null;
      })
      // getAllCampaigns
      .addCase(getAllCampaigns.pending, (state) => {
        state.getAllCampaigns.isLoading = true;
        state.getAllCampaigns.message = "";
        state.getAllCampaigns.isError = false;
        state.getAllCampaigns.isSuccess = false;
        state.getAllCampaigns.data = null;
      })
      .addCase(getAllCampaigns.fulfilled, (state, action) => {
        state.getAllCampaigns.isLoading = false;
        state.getAllCampaigns.isSuccess = true;
        state.getAllCampaigns.data = action.payload;
      })
      .addCase(getAllCampaigns.rejected, (state, action) => {
        state.getAllCampaigns.message = action.payload?.message || "Failed to fetch campaigns";
        state.getAllCampaigns.isLoading = false;
        state.getAllCampaigns.isError = true;
        state.getAllCampaigns.data = null;
      })
      // getCampaignById
      .addCase(getCampaignById.pending, (state) => {
        state.getCampaignById.isLoading = true;
        state.getCampaignById.message = "";
        state.getCampaignById.isError = false;
        state.getCampaignById.isSuccess = false;
        state.getCampaignById.data = null;
      })
      .addCase(getCampaignById.fulfilled, (state, action) => {
        state.getCampaignById.isLoading = false;
        state.getCampaignById.isSuccess = true;
        state.getCampaignById.data = action.payload;
      })
      .addCase(getCampaignById.rejected, (state, action) => {
        state.getCampaignById.message = action.payload?.message || "Failed to fetch campaign";
        state.getCampaignById.isLoading = false;
        state.getCampaignById.isError = true;
        state.getCampaignById.data = null;
      })
      // updateCampaign
      .addCase(updateCampaign.pending, (state) => {
        state.updateCampaign.isLoading = true;
        state.updateCampaign.message = "";
        state.updateCampaign.isError = false;
        state.updateCampaign.isSuccess = false;
        state.updateCampaign.data = null;
      })
      .addCase(updateCampaign.fulfilled, (state, action) => {
        state.updateCampaign.isLoading = false;
        state.updateCampaign.isSuccess = true;
        state.updateCampaign.data = action.payload;
      })
      .addCase(updateCampaign.rejected, (state, action) => {
        state.updateCampaign.message = action.payload?.message || "Failed to update campaign";
        state.updateCampaign.isLoading = false;
        state.updateCampaign.isError = true;
        state.updateCampaign.data = null;
      })
      // deleteCampaign
      .addCase(deleteCampaign.pending, (state) => {
        state.deleteCampaign.isLoading = true;
        state.deleteCampaign.message = "";
        state.deleteCampaign.isError = false;
        state.deleteCampaign.isSuccess = false;
        state.deleteCampaign.data = null;
      })
      .addCase(deleteCampaign.fulfilled, (state, action) => {
        state.deleteCampaign.isLoading = false;
        state.deleteCampaign.isSuccess = true;
        state.deleteCampaign.data = action.payload;
      })
      .addCase(deleteCampaign.rejected, (state, action) => {
        state.deleteCampaign.message = action.payload?.message || "Failed to delete campaign";
        state.deleteCampaign.isLoading = false;
        state.deleteCampaign.isError = true;
        state.deleteCampaign.data = null;
      })
      // publishCampaign
      .addCase(publishCampaign.pending, (state) => {
        state.publishCampaign.isLoading = true;
        state.publishCampaign.message = "";
        state.publishCampaign.isError = false;
        state.publishCampaign.isSuccess = false;
        state.publishCampaign.data = null;
      })
      .addCase(publishCampaign.fulfilled, (state, action) => {
        state.publishCampaign.isLoading = false;
        state.publishCampaign.isSuccess = true;
        state.publishCampaign.data = action.payload;
      })
      .addCase(publishCampaign.rejected, (state, action) => {
        state.publishCampaign.message = action.payload?.message || "Failed to publish campaign";
        state.publishCampaign.isLoading = false;
        state.publishCampaign.isError = true;
        state.publishCampaign.data = null;
      })
      // filterCampaigns
      .addCase(filterCampaigns.pending, (state) => {
        state.filterCampaigns.isLoading = true;
        state.filterCampaigns.message = "";
        state.filterCampaigns.isError = false;
        state.filterCampaigns.isSuccess = false;
        state.filterCampaigns.data = null;
      })
      .addCase(filterCampaigns.fulfilled, (state, action) => {
        state.filterCampaigns.isLoading = false;
        state.filterCampaigns.isSuccess = true;
        state.filterCampaigns.data = action.payload;
      })
      .addCase(filterCampaigns.rejected, (state, action) => {
        state.filterCampaigns.message = action.payload?.message || "Failed to filter campaigns";
        state.filterCampaigns.isLoading = false;
        state.filterCampaigns.isError = true;
        state.filterCampaigns.data = null;
      })
      // getCampaignStats
      .addCase(getCampaignStats.pending, (state) => {
        state.getCampaignStats.isLoading = true;
        state.getCampaignStats.message = "";
        state.getCampaignStats.isError = false;
        state.getCampaignStats.isSuccess = false;
        state.getCampaignStats.data = null;
      })
      .addCase(getCampaignStats.fulfilled, (state, action) => {
        state.getCampaignStats.isLoading = false;
        state.getCampaignStats.isSuccess = true;
        state.getCampaignStats.data = action.payload;
      })
      .addCase(getCampaignStats.rejected, (state, action) => {
        state.getCampaignStats.message =
          action.payload?.message || "Failed to fetch campaign stats";
        state.getCampaignStats.isLoading = false;
        state.getCampaignStats.isError = true;
        state.getCampaignStats.data = null;
      });
  },
});

export const { reset, resetCreateCampaign, resetUpdateCampaign } = campaignsSlice.actions;
export default campaignsSlice.reducer;
