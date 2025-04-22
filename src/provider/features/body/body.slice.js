import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import bodyService from './body.service';

const generalState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
  data: null
};

const initialState = {
  createBody: { ...generalState },
  getAllBody: { ...generalState },
  deleteBody: { ...generalState },
  updateBody: { ...generalState }
};

export const createBody = createAsyncThunk(
  '/createBody',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await bodyService.createInvoiceBody(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const getAllBody = createAsyncThunk(
  '/getAllBody',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await bodyService.getAllInvoiceBody(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const getSingleBody = createAsyncThunk(
  '/getSingleBody',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await bodyService.getAllInvoiceBody(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const deleteBody = createAsyncThunk(
  '/deleteBody',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await bodyService.deleteInvoiceBody(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const updateBody = createAsyncThunk(
  '/updateBody',
  async ({ payload, id, callBackMessage }, thunkAPI) => {
    try {
      const response = await bodyService.updateInvoiceBody(payload, id);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

const body = createSlice({
  name: 'body',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createBody.pending, (state) => {
        state.createBody.isLoading = true;
        state.createBody.message = '';
        state.createBody.isError = false;
        state.createBody.isSuccess = false;
        state.createBody.data = null;
      })
      .addCase(createBody.fulfilled, (state, action) => {
        state.createBody.isLoading = false;
        state.createBody.isSuccess = true;
        state.createBody.data = action.payload;
      })
      .addCase(createBody.rejected, (state, action) => {
        state.createBody.message = action.payload.message;
        state.createBody.isLoading = false;
        state.createBody.isError = true;
        state.createBody.data = null;
      })
      .addCase(getAllBody.pending, (state) => {
        state.getAllBody.isLoading = true;
        state.getAllBody.message = '';
        state.getAllBody.isError = false;
        state.getAllBody.isSuccess = false;
        state.getAllBody.data = null;
      })
      .addCase(getAllBody.fulfilled, (state, action) => {
        state.getAllBody.isLoading = false;
        state.getAllBody.isSuccess = true;
        state.getAllBody.data = action.payload;
      })
      .addCase(getAllBody.rejected, (state, action) => {
        state.getAllBody.message = action.payload.message;
        state.getAllBody.isLoading = false;
        state.getAllBody.isError = true;
        state.getAllBody.data = null;
      })
      .addCase(deleteBody.pending, (state) => {
        state.deleteBody.isLoading = true;
        state.deleteBody.message = '';
        state.deleteBody.isError = false;
        state.deleteBody.isSuccess = false;
        state.deleteBody.data = null;
      })
      .addCase(deleteBody.fulfilled, (state, action) => {
        state.deleteBody.isLoading = false;
        state.deleteBody.isSuccess = true;
        state.deleteBody.data = action.payload;
      })
      .addCase(deleteBody.rejected, (state, action) => {
        state.deleteBody.message = action.payload.message;
        state.deleteBody.isLoading = false;
        state.deleteBody.isError = true;
        state.deleteBody.data = null;
      })
      .addCase(updateBody.pending, (state) => {
        state.updateBody.isLoading = true;
        state.updateBody.message = '';
        state.updateBody.isError = false;
        state.updateBody.isSuccess = false;
        state.updateBody.data = null;
      })
      .addCase(updateBody.fulfilled, (state, action) => {
        state.updateBody.isLoading = false;
        state.updateBody.isSuccess = true;
        state.updateBody.data = action.payload;
      })
      .addCase(updateBody.rejected, (state, action) => {
        state.updateBody.message = action.payload.message;
        state.updateBody.isLoading = false;
        state.updateBody.isError = true;
        state.updateBody.data = null;
      });
  }
});

export default body.reducers;
