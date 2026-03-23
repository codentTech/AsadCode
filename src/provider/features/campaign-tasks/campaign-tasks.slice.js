import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import campaignTaskService from "./campaign-tasks.service";

const generalState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
  data: null,
};

const initialState = {
  tasks: [],
  brandTasks: [],
  creatorTasks: [],
  createTask: generalState,
  updateTask: generalState,
  deleteTask: generalState,
  getTasksByCampaign: generalState,
  getAllTasks: generalState,
  getBrandTasks: generalState,
  getCreatorTasks: generalState,
};

// Create task
export const createTask = createAsyncThunk(
  "campaignTasks/createTask",
  async (payload, thunkAPI) => {
    try {
      const response = await campaignTaskService.createTask(payload);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

// Get all tasks
export const getAllTasks = createAsyncThunk("campaignTasks/getAllTasks", async (_, thunkAPI) => {
  try {
    const response = await campaignTaskService.getAllTasks();
    if (response.success) return response;
    return thunkAPI.rejectWithValue(response);
  } catch (error) {
    return thunkAPI.rejectWithValue({ payload: error });
  }
});

// Get tasks by campaign
export const getTasksByCampaign = createAsyncThunk(
  "campaignTasks/getTasksByCampaign",
  async (campaignId, thunkAPI) => {
    try {
      const response = await campaignTaskService.getTasksByCampaign(campaignId);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

// Update task
export const updateTask = createAsyncThunk(
  "campaignTasks/updateTask",
  async ({ taskId, updateData }, thunkAPI) => {
    try {
      const response = await campaignTaskService.updateTask(taskId, updateData);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

// Delete task
export const deleteTask = createAsyncThunk("campaignTasks/deleteTask", async (taskId, thunkAPI) => {
  try {
    const response = await campaignTaskService.deleteTask(taskId);
    if (response.success) return response;
    return thunkAPI.rejectWithValue(response);
  } catch (error) {
    return thunkAPI.rejectWithValue({ payload: error });
  }
});

// Get brand tasks
export const getBrandTasks = createAsyncThunk(
  "campaignTasks/getBrandTasks",
  async (campaignId = null, thunkAPI) => {
    try {
      const response = await campaignTaskService.getBrandTasks(campaignId);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

// Get creator tasks
export const getCreatorTasks = createAsyncThunk(
  "campaignTasks/getCreatorTasks",
  async (_, thunkAPI) => {
    try {
      const response = await campaignTaskService.getCreatorTasks();
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const campaignTasksSlice = createSlice({
  name: "campaignTasks",
  initialState,
  reducers: {
    reset: (state) => {
      state.createTask = generalState;
      state.updateTask = generalState;
      state.deleteTask = generalState;
      state.getTasksByCampaign = generalState;
      state.getAllTasks = generalState;
      state.getBrandTasks = generalState;
      state.getCreatorTasks = generalState;
    },
    clearTasks: (state) => {
      state.tasks = [];
      state.brandTasks = [];
      state.creatorTasks = [];
    },
    removeTaskFromList: (state, action) => {
      const taskId = action.payload;
      state.tasks = state.tasks.filter((task) => task.id !== taskId);
      state.brandTasks = state.brandTasks.filter((task) => task.id !== taskId);
      state.creatorTasks = state.creatorTasks.filter((task) => task.id !== taskId);
    },
  },
  extraReducers: (builder) => {
    builder
      // Create task
      .addCase(createTask.pending, (state) => {
        state.createTask.isLoading = true;
        state.createTask.message = "";
        state.createTask.isError = false;
        state.createTask.isSuccess = false;
        state.createTask.data = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.createTask.isLoading = false;
        state.createTask.isSuccess = true;
        state.createTask.data = action.payload.data;
        state.tasks.unshift(action.payload.data);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.createTask.message = action.payload.message;
        state.createTask.isLoading = false;
        state.createTask.isError = true;
        state.createTask.data = null;
      })

      // Get all tasks
      .addCase(getAllTasks.pending, (state) => {
        state.getAllTasks.isLoading = true;
        state.getAllTasks.message = "";
        state.getAllTasks.isError = false;
        state.getAllTasks.isSuccess = false;
        state.getAllTasks.data = null;
      })
      .addCase(getAllTasks.fulfilled, (state, action) => {
        state.getAllTasks.isLoading = false;
        state.getAllTasks.isSuccess = true;
        state.getAllTasks.data = action.payload.data;
        state.tasks = action.payload.data;
      })
      .addCase(getAllTasks.rejected, (state, action) => {
        state.getAllTasks.message = action.payload.message;
        state.getAllTasks.isLoading = false;
        state.getAllTasks.isError = true;
        state.getAllTasks.data = null;
      })

      // Get tasks by campaign
      .addCase(getTasksByCampaign.pending, (state) => {
        state.getTasksByCampaign.isLoading = true;
        state.getTasksByCampaign.message = "";
        state.getTasksByCampaign.isError = false;
        state.getTasksByCampaign.isSuccess = false;
        state.getTasksByCampaign.data = null;
      })
      .addCase(getTasksByCampaign.fulfilled, (state, action) => {
        state.getTasksByCampaign.isLoading = false;
        state.getTasksByCampaign.isSuccess = true;
        state.getTasksByCampaign.data = action.payload.data;
        state.tasks = action.payload.data;
      })
      .addCase(getTasksByCampaign.rejected, (state, action) => {
        state.getTasksByCampaign.message = action.payload.message;
        state.getTasksByCampaign.isLoading = false;
        state.getTasksByCampaign.isError = true;
        state.getTasksByCampaign.data = null;
      })

      // Update task
      .addCase(updateTask.pending, (state) => {
        state.updateTask.isLoading = true;
        state.updateTask.message = "";
        state.updateTask.isError = false;
        state.updateTask.isSuccess = false;
        state.updateTask.data = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.updateTask.isLoading = false;
        state.updateTask.isSuccess = true;
        state.updateTask.data = action.payload.data;
        // Update task in tasks array
        if (action.payload.data && action.payload.data.id) {
          const taskIndex = state.tasks.findIndex((task) => task.id === action.payload.data.id);
          if (taskIndex !== -1) {
            state.tasks[taskIndex] = action.payload.data;
          }
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.updateTask.message = action.payload.message;
        state.updateTask.isLoading = false;
        state.updateTask.isError = true;
        state.updateTask.data = null;
      })

      // Delete task
      .addCase(deleteTask.pending, (state) => {
        state.deleteTask.isLoading = true;
        state.deleteTask.message = "";
        state.deleteTask.isError = false;
        state.deleteTask.isSuccess = false;
        state.deleteTask.data = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.deleteTask.isLoading = false;
        state.deleteTask.isSuccess = true;
        state.deleteTask.data = action.payload.data;
        // Remove task from tasks array
        if (action.payload.taskId) {
          state.tasks = state.tasks.filter((task) => task.id !== action.payload.taskId);
        }
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.deleteTask.message = action.payload.message;
        state.deleteTask.isLoading = false;
        state.deleteTask.isError = true;
        state.deleteTask.data = null;
      })

      // Get brand tasks
      .addCase(getBrandTasks.pending, (state) => {
        state.getBrandTasks.isLoading = true;
        state.getBrandTasks.message = "";
        state.getBrandTasks.isError = false;
        state.getBrandTasks.isSuccess = false;
        state.getBrandTasks.data = null;
      })
      .addCase(getBrandTasks.fulfilled, (state, action) => {
        state.getBrandTasks.isLoading = false;
        state.getBrandTasks.isSuccess = true;
        state.getBrandTasks.data = action.payload.data;
        state.brandTasks = action.payload.data || [];
      })
      .addCase(getBrandTasks.rejected, (state, action) => {
        state.getBrandTasks.message = action.payload?.message || "Failed to fetch brand tasks";
        state.getBrandTasks.isLoading = false;
        state.getBrandTasks.isError = true;
        state.getBrandTasks.data = null;
      })

      // Get creator tasks
      .addCase(getCreatorTasks.pending, (state) => {
        state.getCreatorTasks.isLoading = true;
        state.getCreatorTasks.message = "";
        state.getCreatorTasks.isError = false;
        state.getCreatorTasks.isSuccess = false;
        state.getCreatorTasks.data = null;
      })
      .addCase(getCreatorTasks.fulfilled, (state, action) => {
        state.getCreatorTasks.isLoading = false;
        state.getCreatorTasks.isSuccess = true;
        state.getCreatorTasks.data = action.payload.data;
        state.creatorTasks = action.payload.data || [];
      })
      .addCase(getCreatorTasks.rejected, (state, action) => {
        state.getCreatorTasks.message = action.payload?.message || "Failed to fetch creator tasks";
        state.getCreatorTasks.isLoading = false;
        state.getCreatorTasks.isError = true;
        state.getCreatorTasks.data = null;
      });
  },
});

export const { reset, clearTasks, removeTaskFromList } = campaignTasksSlice.actions;

export default campaignTasksSlice.reducer;
