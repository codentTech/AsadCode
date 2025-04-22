import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import offerBodyService from './offer-body.service';

const generalState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
  data: null
};

const initialState = {
  createOfferBody: { ...generalState }
};

export const createOfferBody = createAsyncThunk(
  '/offer-body',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await offerBodyService.createOfferBody(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const getAllOfferBody = createAsyncThunk(
  '/offer-body',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await offerBodyService.getAllOfferBody(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const deleteOfferBody = createAsyncThunk(
  '/offer-body',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await offerBodyService.deleteOfferBody(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const updateOfferBody = createAsyncThunk(
  '/offer-body',
  async ({ payload, id, callBackMessage }, thunkAPI) => {
    try {
      const response = await offerBodyService.updateOfferBody(payload, id);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

const offerBody = createSlice({
  name: 'offerBody',
  initialState,
  reducers: {},
  extraReducers: (builder) => {}
});

export default offerBody.reducers;
