import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import campaignTimelineService from "./campaign-timeline.service";

// Helper function to extract serializable error information
const getSerializableError = (error, defaultMessage) => {
  const errorMessage = error.response?.data?.message || error.message || defaultMessage;
  return { message: errorMessage };
};

const generalState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
  data: null,
};

const initialState = {
  getTimeline: { ...generalState },
  initializeTimeline: { ...generalState },
  updateTimelineStep: { ...generalState },
  approveDraft: { ...generalState },
  requestRevision: { ...generalState },
  markFinalComplete: { ...generalState },
};

// Get timeline
export const getTimeline = createAsyncThunk(
  "campaignTimeline/getTimeline",
  async (campaignId, thunkAPI) => {
    try {
      const response = await campaignTimelineService.getTimeline(campaignId);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error, "Failed to fetch timeline"));
    }
  }
);

// Initialize timeline
export const initializeTimeline = createAsyncThunk(
  "campaignTimeline/initializeTimeline",
  async (campaignId, thunkAPI) => {
    try {
      const response = await campaignTimelineService.initializeTimeline(campaignId);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error, "Failed to initialize timeline"));
    }
  }
);

// Update timeline step
export const updateTimelineStep = createAsyncThunk(
  "campaignTimeline/updateTimelineStep",
  async ({ campaignId, step, data }, thunkAPI) => {
    try {
      const response = await campaignTimelineService.updateTimelineStep(campaignId, step, data);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getSerializableError(error, "Failed to update timeline step")
      );
    }
  }
);

// Approve draft
export const approveDraft = createAsyncThunk(
  "campaignTimeline/approveDraft",
  async ({ campaignId, step }, thunkAPI) => {
    try {
      const response = await campaignTimelineService.approveDraft(campaignId, step);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error, "Failed to approve draft"));
    }
  }
);

// Request revision
export const requestRevision = createAsyncThunk(
  "campaignTimeline/requestRevision",
  async ({ campaignId, step, revisionNotes }, thunkAPI) => {
    try {
      const response = await campaignTimelineService.requestRevision(
        campaignId,
        step,
        revisionNotes
      );
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error, "Failed to request revision"));
    }
  }
);

// Mark final complete
export const markFinalComplete = createAsyncThunk(
  "campaignTimeline/markFinalComplete",
  async ({ campaignId, step }, thunkAPI) => {
    try {
      const response = await campaignTimelineService.markFinalComplete(campaignId, step);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error, "Failed to mark complete"));
    }
  }
);

const campaignTimelineSlice = createSlice({
  name: "campaignTimeline",
  initialState,
  reducers: {
    resetTimelineState: (state) => {
      Object.keys(state).forEach((key) => {
        state[key] = { ...generalState };
      });
    },
  },
  extraReducers: (builder) => {
    // Get timeline
    builder
      .addCase(getTimeline.pending, (state) => {
        state.getTimeline.isLoading = true;
        state.getTimeline.isError = false;
        state.getTimeline.isSuccess = false;
      })
      .addCase(getTimeline.fulfilled, (state, action) => {
        state.getTimeline.isLoading = false;
        state.getTimeline.isSuccess = true;
        state.getTimeline.data = action.payload;
        state.getTimeline.message = action.payload.message;
      })
      .addCase(getTimeline.rejected, (state, action) => {
        state.getTimeline.isLoading = false;
        state.getTimeline.isError = true;
        state.getTimeline.message = action.payload?.message || "Failed to fetch timeline";
      });

    // Initialize timeline
    builder
      .addCase(initializeTimeline.pending, (state) => {
        state.initializeTimeline.isLoading = true;
        state.initializeTimeline.isError = false;
        state.initializeTimeline.isSuccess = false;
      })
      .addCase(initializeTimeline.fulfilled, (state, action) => {
        state.initializeTimeline.isLoading = false;
        state.initializeTimeline.isSuccess = true;
        state.initializeTimeline.data = action.payload;
        state.getTimeline.data = action.payload; // Also update getTimeline data
      })
      .addCase(initializeTimeline.rejected, (state, action) => {
        state.initializeTimeline.isLoading = false;
        state.initializeTimeline.isError = true;
        state.initializeTimeline.message = action.payload?.message;
      });

    // Update timeline step
    builder
      .addCase(updateTimelineStep.pending, (state) => {
        state.updateTimelineStep.isLoading = true;
        state.updateTimelineStep.isError = false;
        state.updateTimelineStep.isSuccess = false;
      })
      .addCase(updateTimelineStep.fulfilled, (state, action) => {
        state.updateTimelineStep.isLoading = false;
        state.updateTimelineStep.isSuccess = true;
        state.updateTimelineStep.data = action.payload;
        // Update the timeline in getTimeline.data
        if (state.getTimeline.data?.data) {
          const updatedStep = action.payload.data;
          state.getTimeline.data.data = state.getTimeline.data.data.map((step) =>
            step.id === updatedStep.id ? updatedStep : step
          );
        }
      })
      .addCase(updateTimelineStep.rejected, (state, action) => {
        state.updateTimelineStep.isLoading = false;
        state.updateTimelineStep.isError = true;
        state.updateTimelineStep.message = action.payload?.message;
      });

    // Approve draft
    builder
      .addCase(approveDraft.pending, (state) => {
        state.approveDraft.isLoading = true;
        state.approveDraft.isError = false;
        state.approveDraft.isSuccess = false;
      })
      .addCase(approveDraft.fulfilled, (state, action) => {
        state.approveDraft.isLoading = false;
        state.approveDraft.isSuccess = true;
        state.approveDraft.data = action.payload;
        // Update the timeline in getTimeline.data
        if (state.getTimeline.data?.data) {
          const updatedStep = action.payload.data;
          state.getTimeline.data.data = state.getTimeline.data.data.map((step) =>
            step.id === updatedStep.id ? updatedStep : step
          );
        }
      })
      .addCase(approveDraft.rejected, (state, action) => {
        state.approveDraft.isLoading = false;
        state.approveDraft.isError = true;
        state.approveDraft.message = action.payload?.message;
      });

    // Request revision
    builder
      .addCase(requestRevision.pending, (state) => {
        state.requestRevision.isLoading = true;
        state.requestRevision.isError = false;
        state.requestRevision.isSuccess = false;
      })
      .addCase(requestRevision.fulfilled, (state, action) => {
        state.requestRevision.isLoading = false;
        state.requestRevision.isSuccess = true;
        state.requestRevision.data = action.payload;
        // Update the timeline in getTimeline.data
        if (state.getTimeline.data?.data) {
          const updatedStep = action.payload.data;
          state.getTimeline.data.data = state.getTimeline.data.data.map((step) =>
            step.id === updatedStep.id ? updatedStep : step
          );
        }
      })
      .addCase(requestRevision.rejected, (state, action) => {
        state.requestRevision.isLoading = false;
        state.requestRevision.isError = true;
        state.requestRevision.message = action.payload?.message;
      });

    // Mark final complete
    builder
      .addCase(markFinalComplete.pending, (state) => {
        state.markFinalComplete.isLoading = true;
        state.markFinalComplete.isError = false;
        state.markFinalComplete.isSuccess = false;
      })
      .addCase(markFinalComplete.fulfilled, (state, action) => {
        state.markFinalComplete.isLoading = false;
        state.markFinalComplete.isSuccess = true;
        state.markFinalComplete.data = action.payload;
        // Update the timeline in getTimeline.data
        if (state.getTimeline.data?.data) {
          const updatedStep = action.payload.data;
          state.getTimeline.data.data = state.getTimeline.data.data.map((step) =>
            step.id === updatedStep.id ? updatedStep : step
          );
        }
      })
      .addCase(markFinalComplete.rejected, (state, action) => {
        state.markFinalComplete.isLoading = false;
        state.markFinalComplete.isError = true;
        state.markFinalComplete.message = action.payload?.message;
      });
  },
});

export const { resetTimelineState } = campaignTimelineSlice.actions;
export default campaignTimelineSlice.reducer;
