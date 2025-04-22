import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import creditNoteBodyService from './credit-note-body.service';

const generalState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
  data: null
};

const initialState = {
  createCreditNoteBody: { ...generalState }
};

export const createCreditNoteBody = createAsyncThunk(
  '/credit-note-body',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await creditNoteBodyService.createCreditNoteBody(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const getAllCreditNoteBody = createAsyncThunk(
  '/credit-note-body',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await creditNoteBodyService.getAllCreditNoteBody(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const deleteCreditNoteBody = createAsyncThunk(
  '/credit-note-body',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await creditNoteBodyService.deleteCreditNoteBody(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const updateCreditNoteBody = createAsyncThunk(
  '/credit-note-body',
  async ({ payload, id, callBackMessage }, thunkAPI) => {
    try {
      const response = await creditNoteBodyService.updateCreditNoteBody(payload, id);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

const creditNoteBody = createSlice({
  name: 'creditNoteBody',
  initialState,
  reducers: {},
  extraReducers: (builder) => {}
});

export default creditNoteBody.reducers;
