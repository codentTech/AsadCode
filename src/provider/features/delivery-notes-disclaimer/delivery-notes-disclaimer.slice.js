import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import deliveryNotesDisclaimerService from './delivery-notes-disclaimer.service';

const initialState = {
  createDeliveryNotesDisclaimer: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  getAllDeliveryNotesDisclaimer: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  deleteDeliveryNotesDisclaimer: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  updateDeliveryNotesDisclaimer: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  }
};

export const createDeliveryNotesDisclaimer = createAsyncThunk(
  '/deliveryNotes-disclaimer',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await deliveryNotesDisclaimerService.createDeliveryNotesDisclaimer(
        payload
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

export const getAllDeliveryNotesDisclaimer = createAsyncThunk(
  '/deliveryNotes-disclaimer',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await deliveryNotesDisclaimerService.getAllDeliveryNotesDisclaimer(
        payload
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

export const deleteDeliveryNotesDisclaimer = createAsyncThunk(
  '/deliveryNotes-disclaimer',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await deliveryNotesDisclaimerService.deleteDeliveryNotesDisclaimer(
        payload
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

export const updateDeliveryNotesDisclaimer = createAsyncThunk(
  '/deliveryNotes-disclaimer',
  async ({ payload, id, callBackMessage }, thunkAPI) => {
    try {
      const response = await deliveryNotesDisclaimerService.updateDeliveryNotesDisclaimer(
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

export const disclaimerSlice = createSlice({
  name: 'disclaimer',
  initialState,
  reducers: {},
  extraReducers: (builder) => {}
});

export default disclaimerSlice.reducer;
