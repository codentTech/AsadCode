import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import unitService from './unit.service';

const initialState = {
  createUnit: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  getAllUnit: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  getSingleUnit: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  deleteUnit: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  updateUnit: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  }
};

export const createUnit = createAsyncThunk(
  '/createUnit',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await unitService.createUnit(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const getAllUnit = createAsyncThunk(
  '/getAllUnit',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await unitService.getAllUnit(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const getSingleUnit = createAsyncThunk(
  '/getSingleUnit',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await unitService.getSingleUnit(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const deleteUnit = createAsyncThunk(
  '/deleteUnit',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await unitService.deleteUnit(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const updateUnit = createAsyncThunk(
  '/updateUnit',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await unitService.updateUnit(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const unitSlice = createSlice({
  name: 'unit',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createUnit.pending, (state) => {
        state.createUnit.isLoading = true;
        state.createUnit.message = '';
        state.createUnit.isError = false;
        state.createUnit.isSuccess = false;
        state.createUnit.data = null;
      })
      .addCase(createUnit.fulfilled, (state, action) => {
        state.createUnit.isLoading = false;
        state.createUnit.isSuccess = true;
        state.createUnit.data = action.payload;
      })
      .addCase(createUnit.rejected, (state, action) => {
        state.createUnit.message = action.payload.message;
        state.createUnit.isLoading = false;
        state.createUnit.isError = true;
        state.createUnit.data = null;
      })
      .addCase(getAllUnit.pending, (state) => {
        state.getAllUnit.isLoading = true;
        state.getAllUnit.message = '';
        state.getAllUnit.isError = false;
        state.getAllUnit.isSuccess = false;
        state.getAllUnit.data = null;
      })
      .addCase(getAllUnit.fulfilled, (state, action) => {
        state.getAllUnit.isLoading = false;
        state.getAllUnit.isSuccess = true;
        state.getAllUnit.data = action.payload;
      })
      .addCase(getAllUnit.rejected, (state, action) => {
        state.getAllUnit.message = action.payload.message;
        state.getAllUnit.isLoading = false;
        state.getAllUnit.isError = true;
        state.getAllUnit.data = null;
      })
      .addCase(getSingleUnit.pending, (state) => {
        state.getSingleUnit.isLoading = true;
        state.getSingleUnit.message = '';
        state.getSingleUnit.isError = false;
        state.getSingleUnit.isSuccess = false;
        state.getSingleUnit.data = null;
      })
      .addCase(getSingleUnit.fulfilled, (state, action) => {
        state.getSingleUnit.isLoading = false;
        state.getSingleUnit.isSuccess = true;
        state.getSingleUnit.data = action.payload;
      })
      .addCase(getSingleUnit.rejected, (state, action) => {
        state.getSingleUnit.message = action.payload.message;
        state.getSingleUnit.isLoading = false;
        state.getSingleUnit.isError = true;
        state.getSingleUnit.data = null;
      })
      .addCase(deleteUnit.pending, (state) => {
        state.deleteUnit.isLoading = true;
        state.deleteUnit.message = '';
        state.deleteUnit.isError = false;
        state.deleteUnit.isSuccess = false;
        state.deleteUnit.data = null;
      })
      .addCase(deleteUnit.fulfilled, (state, action) => {
        state.deleteUnit.isLoading = false;
        state.deleteUnit.isSuccess = true;
        state.deleteUnit.data = action.payload;
      })
      .addCase(deleteUnit.rejected, (state, action) => {
        state.deleteUnit.message = action.payload.message;
        state.deleteUnit.isLoading = false;
        state.deleteUnit.isError = true;
        state.deleteUnit.data = null;
      })
      .addCase(updateUnit.pending, (state) => {
        state.updateUnit.isLoading = true;
        state.updateUnit.message = '';
        state.updateUnit.isError = false;
        state.updateUnit.isSuccess = false;
        state.updateUnit.data = null;
      })
      .addCase(updateUnit.fulfilled, (state, action) => {
        state.updateUnit.isLoading = false;
        state.updateUnit.isSuccess = true;
        state.updateUnit.data = action.payload;
      })
      .addCase(updateUnit.rejected, (state, action) => {
        state.updateUnit.message = action.payload.message;
        state.updateUnit.isLoading = false;
        state.updateUnit.isError = true;
        state.updateUnit.data = null;
      });
  }
});

export default unitSlice.reducer;
