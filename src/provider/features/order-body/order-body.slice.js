import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import orderBodyService from './order-body.service';

const generalState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
  data: null
};

const initialState = {
  createOrderBody: { ...generalState }
};

export const createOrderBody = createAsyncThunk(
  '/order-body',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await orderBodyService.createOrderBody(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const getAllOrderBody = createAsyncThunk(
  '/order-body',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await orderBodyService.getAllOrderBody(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const deleteOrderBody = createAsyncThunk(
  '/order-body',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await orderBodyService.deleteOrderBody(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const updateOrderBody = createAsyncThunk(
  '/order-body',
  async ({ payload, id, callBackMessage }, thunkAPI) => {
    try {
      const response = await orderBodyService.updateOrderBody(payload, id);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

const orderBody = createSlice({
  name: 'orderBody',
  initialState,
  reducers: {},
  extraReducers: (builder) => {}
});

export default orderBody.reducers;
