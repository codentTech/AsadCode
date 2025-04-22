import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import orderDisclaimerService from './order-disclaimer.service';

const initialState = {
  createOrderDisclaimer: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  getAllOrderDisclaimer: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  deleteOrderDisclaimer: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  updateOrderDisclaimer: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  }
};

export const createOrderDisclaimer = createAsyncThunk(
  '/order-disclaimer',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await orderDisclaimerService.createOrderDisclaimer(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const getAllOrderDisclaimer = createAsyncThunk(
  '/order-disclaimer',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await orderDisclaimerService.getAllOrderDisclaimer(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const deleteOrderDisclaimer = createAsyncThunk(
  '/order-disclaimer',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await orderDisclaimerService.deleteOrderDisclaimer(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const updateOrderDisclaimer = createAsyncThunk(
  '/order-disclaimer',
  async ({ payload, id, callBackMessage }, thunkAPI) => {
    try {
      const response = await orderDisclaimerService.updateOrderDisclaimer(payload, id);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const orderDisclaimerSlice = createSlice({
  name: 'orderDisclaimer',
  initialState,
  reducers: {},
  extraReducers: (builder) => {}
});

export default orderDisclaimerSlice.reducer;
