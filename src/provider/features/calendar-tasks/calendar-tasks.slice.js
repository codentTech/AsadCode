import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import calendarTaskService from "./calendar-tasks.service";

const generalState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
  data: null,
};

const initialState = {
  tasks: [],
  createTask: generalState,
  updateTask: generalState,
  toggleTask: generalState,
  deleteTask: generalState,
  getAllTasks: generalState,
};

// Create calendar task
export const createCalendarTask = createAsyncThunk(
  "calendarTasks/createTask",
  async (payload, thunkAPI) => {
    try {
      const response = await calendarTaskService.createTask(payload);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

// Get all calendar tasks
export const getAllCalendarTasks = createAsyncThunk(
  "calendarTasks/getAllTasks",
  async (_, thunkAPI) => {
    try {
      const response = await calendarTaskService.getAllTasks();
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

// Get tasks by month
export const getTasksByMonth = createAsyncThunk(
  "calendarTasks/getTasksByMonth",
  async ({ month, year }, thunkAPI) => {
    try {
      const response = await calendarTaskService.getTasksByMonth(month, year);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

// Get tasks by campaign
export const getTasksByCampaign = createAsyncThunk(
  "calendarTasks/getTasksByCampaign",
  async (campaignId, thunkAPI) => {
    try {
      const response = await calendarTaskService.getTasksByCampaign(campaignId);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

// Update calendar task
export const updateCalendarTask = createAsyncThunk(
  "calendarTasks/updateTask",
  async ({ taskId, updateData }, thunkAPI) => {
    try {
      const response = await calendarTaskService.updateTask(taskId, updateData);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

// Toggle task status
export const toggleCalendarTaskStatus = createAsyncThunk(
  "calendarTasks/toggleTask",
  async ({ taskId }, thunkAPI) => {
    try {
      const response = await calendarTaskService.toggleTaskStatus(taskId);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

// Delete calendar task
export const deleteCalendarTask = createAsyncThunk(
  "calendarTasks/deleteTask",
  async (taskId, thunkAPI) => {
    try {
      const response = await calendarTaskService.deleteTask(taskId);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const calendarTasksSlice = createSlice({
  name: "calendarTasks",
  initialState,
  reducers: {
    reset: (state) => {
      state.createTask = generalState;
      state.updateTask = generalState;
      state.toggleTask = generalState;
      state.deleteTask = generalState;
      state.getAllTasks = generalState;
    },
    clearTasks: (state) => {
      state.tasks = [];
    },
    removeTaskFromList: (state, action) => {
      const taskId = action.payload;
      state.tasks = state.tasks.filter((task) => task.id !== taskId);
    },
  },
  extraReducers: (builder) => {
    builder
      // Create task
      .addCase(createCalendarTask.pending, (state) => {
        state.createTask.isLoading = true;
        state.createTask.message = "";
        state.createTask.isError = false;
        state.createTask.isSuccess = false;
        state.createTask.data = null;
      })
      .addCase(createCalendarTask.fulfilled, (state, action) => {
        state.createTask.isLoading = false;
        state.createTask.isSuccess = true;
        state.createTask.data = action.payload.data;
        state.tasks.unshift(action.payload.data);
      })
      .addCase(createCalendarTask.rejected, (state, action) => {
        state.createTask.message = action.payload.message;
        state.createTask.isLoading = false;
        state.createTask.isError = true;
        state.createTask.data = null;
      })

      // Get all tasks
      .addCase(getAllCalendarTasks.pending, (state) => {
        state.getAllTasks.isLoading = true;
        state.getAllTasks.message = "";
        state.getAllTasks.isError = false;
        state.getAllTasks.isSuccess = false;
        state.getAllTasks.data = null;
      })
      .addCase(getAllCalendarTasks.fulfilled, (state, action) => {
        state.getAllTasks.isLoading = false;
        state.getAllTasks.isSuccess = true;
        state.getAllTasks.data = action.payload.data;
        state.tasks = action.payload.data;
      })
      .addCase(getAllCalendarTasks.rejected, (state, action) => {
        state.getAllTasks.message = action.payload.message;
        state.getAllTasks.isLoading = false;
        state.getAllTasks.isError = true;
        state.getAllTasks.data = null;
      })

      // Update task
      .addCase(updateCalendarTask.pending, (state) => {
        state.updateTask.isLoading = true;
        state.updateTask.message = "";
        state.updateTask.isError = false;
        state.updateTask.isSuccess = false;
        state.updateTask.data = null;
      })
      .addCase(updateCalendarTask.fulfilled, (state, action) => {
        state.updateTask.isLoading = false;
        state.updateTask.isSuccess = true;
        state.updateTask.data = action.payload.data;
        if (action.payload.data && action.payload.data.id) {
          const taskIndex = state.tasks.findIndex((task) => task.id === action.payload.data.id);
          if (taskIndex !== -1) {
            state.tasks[taskIndex] = action.payload.data;
          }
        }
      })
      .addCase(updateCalendarTask.rejected, (state, action) => {
        state.updateTask.message = action.payload.message;
        state.updateTask.isLoading = false;
        state.updateTask.isError = true;
        state.updateTask.data = null;
      })

      // Toggle task
      .addCase(toggleCalendarTaskStatus.pending, (state) => {
        state.toggleTask.isLoading = true;
        state.toggleTask.message = "";
        state.toggleTask.isError = false;
        state.toggleTask.isSuccess = false;
        state.toggleTask.data = null;
      })
      .addCase(toggleCalendarTaskStatus.fulfilled, (state, action) => {
        state.toggleTask.isLoading = false;
        state.toggleTask.isSuccess = true;
        state.toggleTask.data = action.payload.data;
        if (action.payload.data && action.payload.data.id) {
          const taskIndex = state.tasks.findIndex((task) => task.id === action.payload.data.id);
          if (taskIndex !== -1) {
            state.tasks[taskIndex] = action.payload.data;
          }
        }
      })
      .addCase(toggleCalendarTaskStatus.rejected, (state, action) => {
        state.toggleTask.message = action.payload.message;
        state.toggleTask.isLoading = false;
        state.toggleTask.isError = true;
        state.toggleTask.data = null;
      })

      // Delete task
      .addCase(deleteCalendarTask.pending, (state) => {
        state.deleteTask.isLoading = true;
        state.deleteTask.message = "";
        state.deleteTask.isError = false;
        state.deleteTask.isSuccess = false;
        state.deleteTask.data = null;
      })
      .addCase(deleteCalendarTask.fulfilled, (state, action) => {
        state.deleteTask.isLoading = false;
        state.deleteTask.isSuccess = true;
        state.deleteTask.data = action.payload.data;
        if (action.payload.taskId) {
          state.tasks = state.tasks.filter((task) => task.id !== action.payload.taskId);
        }
      })
      .addCase(deleteCalendarTask.rejected, (state, action) => {
        state.deleteTask.message = action.payload.message;
        state.deleteTask.isLoading = false;
        state.deleteTask.isError = true;
        state.deleteTask.data = null;
      });
  },
});

export const { reset, clearTasks, removeTaskFromList } = calendarTasksSlice.actions;

export default calendarTasksSlice.reducer;
