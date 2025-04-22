import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import invoiceReminderService from './reminder.service';

const initialState = {
  createInvoiceReminder: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  updateInvoiceReminder: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  getInvoiceReminder: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  deleteInvoiceReminder: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  }
};

export const createInvoiceReminder = createAsyncThunk(
  'createInvoiceReminder',
  async ({ payload, document }, thunkAPI) => {
    try {
      const response = await invoiceReminderService.createInvoiceReminder(
        payload,
        document
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

export const updateInvoiceReminder = createAsyncThunk(
  'updateInvoiceReminder',
  async ({ payload, id, document }, thunkAPI) => {
    try {
      const response = await invoiceReminderService.updateInvoiceReminder(
        payload,
        id,
        document
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

export const getInvoiceReminder = createAsyncThunk(
  'getInvoiceReminder',
  async ({ payload }, thunkAPI) => {
    try {
      const response = await invoiceReminderService.getInvoiceReminder(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const deleteInvoiceReminder = createAsyncThunk(
  'deleteInvoiceReminder',
  async ({ payload }, thunkAPI) => {
    try {
      const response = await invoiceReminderService.deleteInvoiceReminder(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const invoiceReminderSlice = createSlice({
  name: 'invoiceReminder',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createInvoiceReminder.pending, (state) => {
        state.createInvoiceReminder.isLoading = true;
        state.createInvoiceReminder.message = '';
        state.createInvoiceReminder.isError = false;
        state.createInvoiceReminder.isSuccess = false;
        state.createInvoiceReminder.data = null;
      })
      .addCase(createInvoiceReminder.fulfilled, (state, action) => {
        state.createInvoiceReminder.isLoading = false;
        state.createInvoiceReminder.isSuccess = true;
        state.createInvoiceReminder.data = action.payload;
      })
      .addCase(createInvoiceReminder.rejected, (state, action) => {
        state.createInvoiceReminder.message = action.payload.message;
        state.createInvoiceReminder.isLoading = false;
        state.createInvoiceReminder.isError = true;
        state.createInvoiceReminder.data = null;
      })
      .addCase(updateInvoiceReminder.pending, (state) => {
        state.updateInvoiceReminder.isLoading = true;
        state.updateInvoiceReminder.message = '';
        state.updateInvoiceReminder.isError = false;
        state.updateInvoiceReminder.isSuccess = false;
        state.updateInvoiceReminder.data = null;
      })
      .addCase(updateInvoiceReminder.fulfilled, (state, action) => {
        state.updateInvoiceReminder.isLoading = false;
        state.updateInvoiceReminder.isSuccess = true;
        state.updateInvoiceReminder.data = action.payload;
      })
      .addCase(updateInvoiceReminder.rejected, (state, action) => {
        state.updateInvoiceReminder.message = action.payload.message;
        state.updateInvoiceReminder.isLoading = false;
        state.updateInvoiceReminder.isError = true;
        state.updateInvoiceReminder.data = null;
      })
      .addCase(getInvoiceReminder.pending, (state) => {
        state.getInvoiceReminder.isLoading = true;
        state.getInvoiceReminder.message = '';
        state.getInvoiceReminder.isError = false;
        state.getInvoiceReminder.isSuccess = false;
        state.getInvoiceReminder.data = null;
      })
      .addCase(getInvoiceReminder.fulfilled, (state, action) => {
        state.getInvoiceReminder.isLoading = false;
        state.getInvoiceReminder.isSuccess = true;
        state.getInvoiceReminder.data = action.payload;
      })
      .addCase(getInvoiceReminder.rejected, (state, action) => {
        state.getInvoiceReminder.message = action.payload.message;
        state.getInvoiceReminder.isLoading = false;
        state.getInvoiceReminder.isError = true;
        state.getInvoiceReminder.data = null;
      })
      .addCase(deleteInvoiceReminder.pending, (state) => {
        state.deleteInvoiceReminder.isLoading = true;
        state.deleteInvoiceReminder.message = '';
        state.deleteInvoiceReminder.isError = false;
        state.deleteInvoiceReminder.isSuccess = false;
        state.deleteInvoiceReminder.data = null;
      })
      .addCase(deleteInvoiceReminder.fulfilled, (state, action) => {
        state.deleteInvoiceReminder.isLoading = false;
        state.deleteInvoiceReminder.isSuccess = true;
        state.deleteInvoiceReminder.data = action.payload;
      })
      .addCase(deleteInvoiceReminder.rejected, (state, action) => {
        state.deleteInvoiceReminder.message = action.payload.message;
        state.deleteInvoiceReminder.isLoading = false;
        state.deleteInvoiceReminder.isError = true;
        state.deleteInvoiceReminder.data = null;
      });
  }
});

export default invoiceReminderSlice.reducer;
