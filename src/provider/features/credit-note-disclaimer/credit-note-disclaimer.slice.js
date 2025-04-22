import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import creditNoteDisclaimerService from './credit-note-disclaimer.service';

const initialState = {
  createCreditNoteDisclaimer: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  getAllCreditNoteDisclaimer: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  deleteCreditNoteDisclaimer: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  updateCreditNoteDisclaimer: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  }
};

export const createCreditNoteDisclaimer = createAsyncThunk(
  '/credit-note-disclaimer',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await creditNoteDisclaimerService.createCreditNoteDisclaimer(
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

export const getAllCreditNoteDisclaimer = createAsyncThunk(
  '/credit-note-disclaimer',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await creditNoteDisclaimerService.getAllCreditNoteDisclaimer(
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

export const deleteCreditNoteDisclaimer = createAsyncThunk(
  '/credit-note-disclaimer',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await creditNoteDisclaimerService.deleteCreditNoteDisclaimer(
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

export const updateCreditNoteDisclaimer = createAsyncThunk(
  '/credit-note-disclaimer',
  async ({ payload, id, callBackMessage }, thunkAPI) => {
    try {
      const response = await creditNoteDisclaimerService.updateCreditNoteDisclaimer(
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
