import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import monthlyGoalService from "./monthly-goal.service";

const generalState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
  data: null,
};

const initialState = {
  monthlyGoals: [],
  createMonthlyGoal: generalState,
  updateMonthlyGoal: generalState,
  deleteMonthlyGoal: generalState,
  getMonthlyGoalsByCampaign: generalState,
  getAllMonthlyGoals: generalState,
};

// Create monthly goal
export const createMonthlyGoal = createAsyncThunk(
  "monthlyGoals/createMonthlyGoal",
  async ({ campaignId, monthlyGoalData }, thunkAPI) => {
    try {
      const response = await monthlyGoalService.createMonthlyGoal(campaignId, monthlyGoalData);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response.message);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

// Get all monthly goals
export const getAllMonthlyGoals = createAsyncThunk(
  "monthlyGoals/getAllMonthlyGoals",
  async (_, thunkAPI) => {
    try {
      const response = await monthlyGoalService.getAllMonthlyGoals();
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response.message);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

// Get monthly goals by campaign
export const getMonthlyGoalsByCampaign = createAsyncThunk(
  "monthlyGoals/getMonthlyGoalsByCampaign",
  async ({ campaignId, month, year }, thunkAPI) => {
    try {
      const response = await monthlyGoalService.getMonthlyGoalsByCampaign(campaignId, month, year);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response.message);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

// Update monthly goal
export const updateMonthlyGoal = createAsyncThunk(
  "monthlyGoals/updateMonthlyGoal",
  async ({ id, updateData }, thunkAPI) => {
    try {
      const response = await monthlyGoalService.updateMonthlyGoal(id, updateData);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response.message);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

// Delete monthly goal
export const deleteMonthlyGoal = createAsyncThunk(
  "monthlyGoals/deleteMonthlyGoal",
  async (id, thunkAPI) => {
    try {
      const response = await monthlyGoalService.deleteMonthlyGoal(id);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response.message);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

const monthlyGoalSlice = createSlice({
  name: "monthlyGoals",
  initialState,
  reducers: {
    reset: (state) => {
      state.createMonthlyGoal = generalState;
      state.updateMonthlyGoal = generalState;
      state.deleteMonthlyGoal = generalState;
      state.getMonthlyGoalsByCampaign = generalState;
      state.getAllMonthlyGoals = generalState;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create monthly goal
      .addCase(createMonthlyGoal.pending, (state) => {
        state.createMonthlyGoal.isLoading = true;
      })
      .addCase(createMonthlyGoal.fulfilled, (state, action) => {
        state.createMonthlyGoal.isLoading = false;
        state.createMonthlyGoal.isSuccess = true;
        state.createMonthlyGoal.data = action.payload.data;
        // Add to all arrays for consistency
        state.monthlyGoals.unshift(action.payload.data);
        state.getAllMonthlyGoals.data = [
          action.payload.data,
          ...(state.getAllMonthlyGoals.data || []),
        ];
        // Also add to campaign-specific goals if it exists
        if (state.getMonthlyGoalsByCampaign.data) {
          state.getMonthlyGoalsByCampaign.data.unshift(action.payload.data);
        }
      })
      .addCase(createMonthlyGoal.rejected, (state, action) => {
        state.createMonthlyGoal.isLoading = false;
        state.createMonthlyGoal.isError = true;
        state.createMonthlyGoal.message = action.payload;
      })
      // Get all monthly goals
      .addCase(getAllMonthlyGoals.pending, (state) => {
        state.getAllMonthlyGoals.isLoading = true;
      })
      .addCase(getAllMonthlyGoals.fulfilled, (state, action) => {
        state.getAllMonthlyGoals.isLoading = false;
        state.getAllMonthlyGoals.isSuccess = true;
        state.getAllMonthlyGoals.data = action.payload.data;
        state.monthlyGoals = action.payload.data;
      })
      .addCase(getAllMonthlyGoals.rejected, (state, action) => {
        state.getAllMonthlyGoals.isLoading = false;
        state.getAllMonthlyGoals.isError = true;
        state.getAllMonthlyGoals.message = action.payload;
      })
      // Get monthly goals by campaign
      .addCase(getMonthlyGoalsByCampaign.pending, (state) => {
        state.getMonthlyGoalsByCampaign.isLoading = true;
      })
      .addCase(getMonthlyGoalsByCampaign.fulfilled, (state, action) => {
        state.getMonthlyGoalsByCampaign.isLoading = false;
        state.getMonthlyGoalsByCampaign.isSuccess = true;
        state.getMonthlyGoalsByCampaign.data = action.payload.data;
      })
      .addCase(getMonthlyGoalsByCampaign.rejected, (state, action) => {
        state.getMonthlyGoalsByCampaign.isLoading = false;
        state.getMonthlyGoalsByCampaign.isError = true;
        state.getMonthlyGoalsByCampaign.message = action.payload;
      })
      // Update monthly goal
      .addCase(updateMonthlyGoal.pending, (state) => {
        state.updateMonthlyGoal.isLoading = true;
      })
      .addCase(updateMonthlyGoal.fulfilled, (state, action) => {
        state.updateMonthlyGoal.isLoading = false;
        state.updateMonthlyGoal.isSuccess = true;
        state.updateMonthlyGoal.data = action.payload.data;

        // Update in monthlyGoals array
        const goalIndex = state.monthlyGoals.findIndex(
          (goal) => goal.id === action.payload.data.id
        );
        if (goalIndex !== -1) {
          state.monthlyGoals[goalIndex] = action.payload.data;
        }

        // Also update in getAllMonthlyGoals.data
        const allGoalsIndex = (state.getAllMonthlyGoals.data || []).findIndex(
          (goal) => goal.id === action.payload.data.id
        );
        if (allGoalsIndex !== -1) {
          state.getAllMonthlyGoals.data[allGoalsIndex] = action.payload.data;
        }

        // Also update in campaign-specific goals if it exists
        if (state.getMonthlyGoalsByCampaign.data) {
          const campaignGoalIndex = state.getMonthlyGoalsByCampaign.data.findIndex(
            (goal) => goal.id === action.payload.data.id
          );
          if (campaignGoalIndex !== -1) {
            state.getMonthlyGoalsByCampaign.data[campaignGoalIndex] = action.payload.data;
          }
        }
      })
      .addCase(updateMonthlyGoal.rejected, (state, action) => {
        state.updateMonthlyGoal.isLoading = false;
        state.updateMonthlyGoal.isError = true;
        state.updateMonthlyGoal.message = action.payload;
      })
      // Delete monthly goal
      .addCase(deleteMonthlyGoal.pending, (state) => {
        state.deleteMonthlyGoal.isLoading = true;
      })
      .addCase(deleteMonthlyGoal.fulfilled, (state, action) => {
        state.deleteMonthlyGoal.isLoading = false;
        state.deleteMonthlyGoal.isSuccess = true;
        state.deleteMonthlyGoal.data = action.payload.data;

        // Remove from monthlyGoals array
        state.monthlyGoals = state.monthlyGoals.filter((goal) => goal.id !== action.meta.arg);

        // Also remove from getAllMonthlyGoals.data
        state.getAllMonthlyGoals.data = (state.getAllMonthlyGoals.data || []).filter(
          (goal) => goal.id !== action.meta.arg
        );

        // Also remove from campaign-specific goals if it exists
        if (state.getMonthlyGoalsByCampaign.data) {
          state.getMonthlyGoalsByCampaign.data = state.getMonthlyGoalsByCampaign.data.filter(
            (goal) => goal.id !== action.meta.arg
          );
        }
      })
      .addCase(deleteMonthlyGoal.rejected, (state, action) => {
        state.deleteMonthlyGoal.isLoading = false;
        state.deleteMonthlyGoal.isError = true;
        state.deleteMonthlyGoal.message = action.payload;
      });
  },
});

export const { reset } = monthlyGoalSlice.actions;
export default monthlyGoalSlice.reducer;
