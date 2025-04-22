import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import disclaimerService from './disclaimer.service';

const initialState = {
  createDisclaimer: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  getAllDisclaimer: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  deleteDisclaimer: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  updateDisclaimer: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  }
};

export const createDisclaimer = createAsyncThunk(
  '/createDisclaimer',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await disclaimerService.createDisclaimer(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const getAllDisclaimer = createAsyncThunk(
  '/getAllDisclaimer',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await disclaimerService.getAllDisclaimer(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const deleteDisclaimer = createAsyncThunk(
  '/deleteDisclaimer',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await disclaimerService.deleteDisclaimer(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const updateDisclaimer = createAsyncThunk(
  '/updateDisclaimer',
  async ({ payload, id, callBackMessage }, thunkAPI) => {
    try {
      const response = await disclaimerService.updateDisclaimer(payload, id);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const disclaimerSlice = createSlice({
  name: 'disclaimer',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createDisclaimer.pending, (state) => {
        state.createDisclaimer.isLoading = true;
        state.createDisclaimer.message = '';
        state.createDisclaimer.isError = false;
        state.createDisclaimer.isSuccess = false;
        state.createDisclaimer.data = null;
      })
      .addCase(createDisclaimer.fulfilled, (state, action) => {
        state.createDisclaimer.isLoading = false;
        state.createDisclaimer.isSuccess = true;
        state.createDisclaimer.data = action.payload;
      })
      .addCase(createDisclaimer.rejected, (state, action) => {
        state.createDisclaimer.message = action.payload.message;
        state.createDisclaimer.isLoading = false;
        state.createDisclaimer.isError = true;
        state.createDisclaimer.data = null;
      })
      .addCase(getAllDisclaimer.pending, (state) => {
        state.getAllDisclaimer.isLoading = true;
        state.getAllDisclaimer.message = '';
        state.getAllDisclaimer.isError = false;
        state.getAllDisclaimer.isSuccess = false;
        state.getAllDisclaimer.data = null;
      })
      .addCase(getAllDisclaimer.fulfilled, (state, action) => {
        state.getAllDisclaimer.isLoading = false;
        state.getAllDisclaimer.isSuccess = true;
        state.getAllDisclaimer.data = action.payload;
      })
      .addCase(getAllDisclaimer.rejected, (state, action) => {
        state.getAllDisclaimer.message = action.payload.message;
        state.getAllDisclaimer.isLoading = false;
        state.getAllDisclaimer.isError = true;
        state.getAllDisclaimer.data = null;
      })
      .addCase(deleteDisclaimer.pending, (state) => {
        state.deleteDisclaimer.isLoading = true;
        state.deleteDisclaimer.message = '';
        state.deleteDisclaimer.isError = false;
        state.deleteDisclaimer.isSuccess = false;
        state.deleteDisclaimer.data = null;
      })
      .addCase(deleteDisclaimer.fulfilled, (state, action) => {
        state.deleteDisclaimer.isLoading = false;
        state.deleteDisclaimer.isSuccess = true;
        state.deleteDisclaimer.data = action.payload;
      })
      .addCase(deleteDisclaimer.rejected, (state, action) => {
        state.deleteDisclaimer.message = action.payload.message;
        state.deleteDisclaimer.isLoading = false;
        state.deleteDisclaimer.isError = true;
        state.deleteDisclaimer.data = null;
      })
      .addCase(updateDisclaimer.pending, (state) => {
        state.updateDisclaimer.isLoading = true;
        state.updateDisclaimer.message = '';
        state.updateDisclaimer.isError = false;
        state.updateDisclaimer.isSuccess = false;
        state.updateDisclaimer.data = null;
      })
      .addCase(updateDisclaimer.fulfilled, (state, action) => {
        state.updateDisclaimer.isLoading = false;
        state.updateDisclaimer.isSuccess = true;
        state.updateDisclaimer.data = action.payload;
      })
      .addCase(updateDisclaimer.rejected, (state, action) => {
        state.updateDisclaimer.message = action.payload.message;
        state.updateDisclaimer.isLoading = false;
        state.updateDisclaimer.isError = true;
        state.updateDisclaimer.data = null;
      });
  }
});

export default disclaimerSlice.reducer;
