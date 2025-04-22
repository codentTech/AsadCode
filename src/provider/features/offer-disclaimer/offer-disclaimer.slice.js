import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import offerDisclaimerService from './offer-disclaimer.service';

const initialState = {
  createOfferDisclaimer: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  getAllOfferDisclaimer: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  deleteOfferDisclaimer: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  updateOfferDisclaimer: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  }
};

export const createOfferDisclaimer = createAsyncThunk(
  '/offer-disclaimer',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await offerDisclaimerService.createOfferDisclaimer(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const getAllOfferDisclaimer = createAsyncThunk(
  '/offer-disclaimer',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await offerDisclaimerService.getAllOfferDisclaimer(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const deleteOfferDisclaimer = createAsyncThunk(
  '/offer-disclaimer',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await offerDisclaimerService.deleteOfferDisclaimer(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const updateOfferDisclaimer = createAsyncThunk(
  '/offer-disclaimer',
  async ({ payload, id, callBackMessage }, thunkAPI) => {
    try {
      const response = await offerDisclaimerService.updateOfferDisclaimer(payload, id);
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
