import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import deliveryNotesBodyService from './delivery-notes-body.service';

const generalState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
  data: null
};

const initialState = {
  createDeliveryNotesBody: { ...generalState }
};

export const createDeliveryNotesBody = createAsyncThunk(
  '/deliveryNotes-body',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await deliveryNotesBodyService.createDeliveryNotesBody(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const getAllDeliveryNotesBody = createAsyncThunk(
  '/deliveryNotes-body',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await deliveryNotesBodyService.getAllDeliveryNotesBody(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const deleteDeliveryNotesBody = createAsyncThunk(
  '/deliveryNotes-body',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await deliveryNotesBodyService.deleteDeliveryNotesBody(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const updateDeliveryNotesBody = createAsyncThunk(
  '/deliveryNotes-body',
  async ({ payload, id, callBackMessage }, thunkAPI) => {
    try {
      const response = await deliveryNotesBodyService.updateDeliveryNotesBody(
        payload,
        id
      );
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

const deliveryNotesBody = createSlice({
  name: 'deliveryNotesBody',
  initialState,
  reducers: {},
  extraReducers: (builder) => {}
});

export default deliveryNotesBody.reducers;
