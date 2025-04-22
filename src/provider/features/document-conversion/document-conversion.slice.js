import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import documentConversionService from './document-conversion.service';

const initialState = {
  documentConversion: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  documentDuplicate: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  documentSendAsEmail: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  }
};

export const documentConversion = createAsyncThunk(
  '/document/conversion',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await documentConversionService.documentConversion(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const documentDuplicate = createAsyncThunk(
  '/document/duplication',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await documentConversionService.documentDuplicate(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const documentSendAsEmail = createAsyncThunk(
  '/document/send-as-email',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await documentConversionService.documentSendAsEmail(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const documentSendNotifyEmail = createAsyncThunk(
  '/document/send-notify-email',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await documentConversionService.documentSendNotifyEmail(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const documentConversionSlice = createSlice({
  name: 'documentConversion',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(documentConversion.pending, (state) => {
        state.documentConversion.isLoading = true;
        state.documentConversion.message = '';
        state.documentConversion.isError = false;
        state.documentConversion.isSuccess = false;
        state.documentConversion.data = null;
      })
      .addCase(documentConversion.fulfilled, (state, action) => {
        state.documentConversion.isLoading = false;
        state.documentConversion.isSuccess = true;
        state.documentConversion.data = action.payload;
      })
      .addCase(documentConversion.rejected, (state, action) => {
        state.documentConversion.message = action.payload.message;
        state.documentConversion.isLoading = false;
        state.documentConversion.isError = true;
        state.documentConversion.data = null;
      })
      .addCase(documentDuplicate.pending, (state) => {
        state.documentDuplicate.isLoading = true;
        state.documentDuplicate.message = '';
        state.documentDuplicate.isError = false;
        state.documentDuplicate.isSuccess = false;
        state.documentDuplicate.data = null;
      })
      .addCase(documentDuplicate.fulfilled, (state, action) => {
        state.documentDuplicate.isLoading = false;
        state.documentDuplicate.isSuccess = true;
        state.documentDuplicate.data = action.payload;
      })
      .addCase(documentDuplicate.rejected, (state, action) => {
        state.documentDuplicate.message = action.payload.message;
        state.documentDuplicate.isLoading = false;
        state.documentDuplicate.isError = true;
        state.documentDuplicate.data = null;
      })
      .addCase(documentSendAsEmail.pending, (state) => {
        state.documentSendAsEmail.isLoading = true;
        state.documentSendAsEmail.message = '';
        state.documentSendAsEmail.isError = false;
        state.documentSendAsEmail.isSuccess = false;
        state.documentSendAsEmail.data = null;
      })
      .addCase(documentSendAsEmail.fulfilled, (state, action) => {
        state.documentSendAsEmail.isLoading = false;
        state.documentSendAsEmail.isSuccess = true;
        state.documentSendAsEmail.data = action.payload;
      })
      .addCase(documentSendAsEmail.rejected, (state, action) => {
        state.documentSendAsEmail.message = action.payload.message;
        state.documentSendAsEmail.isLoading = false;
        state.documentSendAsEmail.isError = true;
        state.documentSendAsEmail.data = null;
      });
  }
});

export default documentConversionSlice.reducer;
