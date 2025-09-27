import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import contentPlannerService from "./content-planner.service";

const generalState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
  data: null,
};

const initialState = {
  contentPlanners: [],
  createContentPlanner: generalState,
  updateContentPlanner: generalState,
  deleteContentPlanner: generalState,
  getContentPlannerByCampaign: generalState,
  getAllContentPlanners: generalState,
};

// Create content planner
export const createContentPlanner = createAsyncThunk(
  "contentPlanner/createContentPlanner",
  async ({ campaignId, contentPlannerData }, thunkAPI) => {
    try {
      const response = await contentPlannerService.createContentPlanner(
        campaignId,
        contentPlannerData
      );
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

// Get all content planners
export const getAllContentPlanners = createAsyncThunk(
  "contentPlanner/getAllContentPlanners",
  async (_, thunkAPI) => {
    try {
      const response = await contentPlannerService.getAllContentPlanners();
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

// Get content planner by campaign
export const getContentPlannerByCampaign = createAsyncThunk(
  "contentPlanner/getContentPlannerByCampaign",
  async (campaignId, thunkAPI) => {
    try {
      const response = await contentPlannerService.getContentPlannerByCampaign(campaignId);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

// Update content planner
export const updateContentPlanner = createAsyncThunk(
  "contentPlanner/updateContentPlanner",
  async ({ id, updateData }, thunkAPI) => {
    try {
      const response = await contentPlannerService.updateContentPlanner(id, updateData);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

// Delete content planner
export const deleteContentPlanner = createAsyncThunk(
  "contentPlanner/deleteContentPlanner",
  async (id, thunkAPI) => {
    try {
      const response = await contentPlannerService.deleteContentPlanner(id);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const contentPlannerSlice = createSlice({
  name: "contentPlanner",
  initialState,
  reducers: {
    reset: (state) => {
      state.createContentPlanner = generalState;
      state.updateContentPlanner = generalState;
      state.deleteContentPlanner = generalState;
      state.getContentPlannerByCampaign = generalState;
      state.getAllContentPlanners = generalState;
    },
    clearContentPlanners: (state) => {
      state.contentPlanners = [];
    },
    removeContentPlannerFromList: (state, action) => {
      const contentPlannerId = action.payload;
      state.contentPlanners = state.contentPlanners.filter(
        (planner) => planner.id !== contentPlannerId
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // Create content planner
      .addCase(createContentPlanner.pending, (state) => {
        state.createContentPlanner.isLoading = true;
        state.createContentPlanner.message = "";
        state.createContentPlanner.isError = false;
        state.createContentPlanner.isSuccess = false;
        state.createContentPlanner.data = null;
      })
      .addCase(createContentPlanner.fulfilled, (state, action) => {
        state.createContentPlanner.isLoading = false;
        state.createContentPlanner.isSuccess = true;
        state.createContentPlanner.data = action.payload.data;
        // Add to both arrays for consistency
        state.contentPlanners.unshift(action.payload.data);
        state.getAllContentPlanners.data = [
          action.payload.data,
          ...(state.getAllContentPlanners.data || []),
        ];
      })
      .addCase(createContentPlanner.rejected, (state, action) => {
        state.createContentPlanner.message = action.payload.message;
        state.createContentPlanner.isLoading = false;
        state.createContentPlanner.isError = true;
        state.createContentPlanner.data = null;
      })

      // Get all content planners
      .addCase(getAllContentPlanners.pending, (state) => {
        state.getAllContentPlanners.isLoading = true;
        state.getAllContentPlanners.message = "";
        state.getAllContentPlanners.isError = false;
        state.getAllContentPlanners.isSuccess = false;
        state.getAllContentPlanners.data = null;
      })
      .addCase(getAllContentPlanners.fulfilled, (state, action) => {
        state.getAllContentPlanners.isLoading = false;
        state.getAllContentPlanners.isSuccess = true;
        state.getAllContentPlanners.data = action.payload.data;
        state.contentPlanners = action.payload.data;
      })
      .addCase(getAllContentPlanners.rejected, (state, action) => {
        state.getAllContentPlanners.message = action.payload.message;
        state.getAllContentPlanners.isLoading = false;
        state.getAllContentPlanners.isError = true;
        state.getAllContentPlanners.data = null;
      })

      // Get content planner by campaign
      .addCase(getContentPlannerByCampaign.pending, (state) => {
        state.getContentPlannerByCampaign.isLoading = true;
        state.getContentPlannerByCampaign.message = "";
        state.getContentPlannerByCampaign.isError = false;
        state.getContentPlannerByCampaign.isSuccess = false;
        state.getContentPlannerByCampaign.data = null;
      })
      .addCase(getContentPlannerByCampaign.fulfilled, (state, action) => {
        state.getContentPlannerByCampaign.isLoading = false;
        state.getContentPlannerByCampaign.isSuccess = true;
        state.getContentPlannerByCampaign.data = action.payload.data;
      })
      .addCase(getContentPlannerByCampaign.rejected, (state, action) => {
        state.getContentPlannerByCampaign.message = action.payload.message;
        state.getContentPlannerByCampaign.isLoading = false;
        state.getContentPlannerByCampaign.isError = true;
        state.getContentPlannerByCampaign.data = null;
      })

      // Update content planner
      .addCase(updateContentPlanner.pending, (state) => {
        state.updateContentPlanner.isLoading = true;
        state.updateContentPlanner.message = "";
        state.updateContentPlanner.isError = false;
        state.updateContentPlanner.isSuccess = false;
        state.updateContentPlanner.data = null;
      })
      .addCase(updateContentPlanner.fulfilled, (state, action) => {
        state.updateContentPlanner.isLoading = false;
        state.updateContentPlanner.isSuccess = true;
        state.updateContentPlanner.data = action.payload.data;
        // Update content planner in both arrays
        if (action.payload.data && action.payload.data.id) {
          const plannerIndex = state.contentPlanners.findIndex(
            (planner) => planner.id === action.payload.data.id
          );
          if (plannerIndex !== -1) {
            state.contentPlanners[plannerIndex] = action.payload.data;
          }

          // Also update in getAllContentPlanners.data
          const allPlannersIndex = (state.getAllContentPlanners.data || []).findIndex(
            (planner) => planner.id === action.payload.data.id
          );
          if (allPlannersIndex !== -1) {
            state.getAllContentPlanners.data[allPlannersIndex] = action.payload.data;
          }
        }
      })
      .addCase(updateContentPlanner.rejected, (state, action) => {
        state.updateContentPlanner.message = action.payload.message;
        state.updateContentPlanner.isLoading = false;
        state.updateContentPlanner.isError = true;
        state.updateContentPlanner.data = null;
      })

      // Delete content planner
      .addCase(deleteContentPlanner.pending, (state) => {
        state.deleteContentPlanner.isLoading = true;
        state.deleteContentPlanner.message = "";
        state.deleteContentPlanner.isError = false;
        state.deleteContentPlanner.isSuccess = false;
        state.deleteContentPlanner.data = null;
      })
      .addCase(deleteContentPlanner.fulfilled, (state, action) => {
        state.deleteContentPlanner.isLoading = false;
        state.deleteContentPlanner.isSuccess = true;
        state.deleteContentPlanner.data = action.payload.data;
        // Remove content planner from both arrays
        if (action.payload.id) {
          state.contentPlanners = state.contentPlanners.filter(
            (planner) => planner.id !== action.payload.id
          );
          state.getAllContentPlanners.data = (state.getAllContentPlanners.data || []).filter(
            (planner) => planner.id !== action.payload.id
          );
        }
      })
      .addCase(deleteContentPlanner.rejected, (state, action) => {
        state.deleteContentPlanner.message = action.payload.message;
        state.deleteContentPlanner.isLoading = false;
        state.deleteContentPlanner.isError = true;
        state.deleteContentPlanner.data = null;
      });
  },
});

export const { reset, clearContentPlanners, removeContentPlannerFromList } =
  contentPlannerSlice.actions;

export default contentPlannerSlice.reducer;
