import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import smtpService from './smtp.service';

const initialState = {
  createSmtp: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  getSmtp: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  updateSmtp: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  toggleSmtp: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  }
};

export const createSmtp = createAsyncThunk(
  'smtp/createSmtp',
  async ({ payload }, thunkAPI) => {
    try {
      const response = await smtpService.createSmtp(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const getSmtp = createAsyncThunk('smtp/getSmtp', async (_, thunkAPI) => {
  try {
    const response = await smtpService.getSmtp();
    if (response.Succeeded) {
      return response.data;
    }
    return thunkAPI.rejectWithValue(response);
  } catch (error) {
    return thunkAPI.rejectWithValue({ payload: error });
  }
});

export const updateSmtp = createAsyncThunk(
  'smtp/updateSmtp',
  async ({ payload, id, callBackMessage }, thunkAPI) => {
    try {
      const response = await smtpService.updateSmtp(payload, id);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const toggleSmtp = createAsyncThunk('smtp/toggleSmtp', async (_, thunkAPI) => {
  try {
    const response = await smtpService.toggleSmtp();
    if (response.Succeeded) {
      return response.data;
    }
    return thunkAPI.rejectWithValue(response);
  } catch (error) {
    return thunkAPI.rejectWithValue({ payload: error });
  }
});

export const smtpSlice = createSlice({
  name: 'smtp',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createSmtp.pending, (state) => {
        state.createSmtp.isLoading = true;
        state.createSmtp.message = '';
        state.createSmtp.isError = false;
        state.createSmtp.isSuccess = false;
        state.createSmtp.data = null;
      })
      .addCase(createSmtp.fulfilled, (state, action) => {
        state.createSmtp.isLoading = false;
        state.createSmtp.isSuccess = true;
        state.createSmtp.data = action.payload;
      })
      .addCase(createSmtp.rejected, (state, action) => {
        state.createSmtp.message = action.payload.message;
        state.createSmtp.isLoading = false;
        state.createSmtp.isError = true;
        state.createSmtp.data = null;
      })
      .addCase(getSmtp.pending, (state) => {
        state.getSmtp.isLoading = true;
        state.getSmtp.message = '';
        state.getSmtp.isError = false;
        state.getSmtp.isSuccess = false;
        state.getSmtp.data = null;
      })
      .addCase(getSmtp.fulfilled, (state, action) => {
        state.getSmtp.isLoading = false;
        state.getSmtp.isSuccess = true;
        state.getSmtp.data = action.payload;
      })
      .addCase(getSmtp.rejected, (state, action) => {
        state.getSmtp.message = action.payload.message;
        state.getSmtp.isLoading = false;
        state.getSmtp.isError = true;
        state.getSmtp.data = null;
      })
      .addCase(updateSmtp.pending, (state) => {
        state.updateSmtp.isLoading = true;
        state.updateSmtp.message = '';
        state.updateSmtp.isError = false;
        state.updateSmtp.isSuccess = false;
        state.updateSmtp.data = null;
      })
      .addCase(updateSmtp.fulfilled, (state, action) => {
        state.updateSmtp.isLoading = false;
        state.updateSmtp.isSuccess = true;
        state.updateSmtp.data = action.payload;
      })
      .addCase(updateSmtp.rejected, (state, action) => {
        state.updateSmtp.message = action.payload.message;
        state.updateSmtp.isLoading = false;
        state.updateSmtp.isError = true;
        state.updateSmtp.data = null;
      })
      .addCase(toggleSmtp.pending, (state) => {
        state.toggleSmtp.isLoading = true;
        state.toggleSmtp.message = '';
        state.toggleSmtp.isError = false;
        state.toggleSmtp.isSuccess = false;
        state.toggleSmtp.data = null;
      })
      .addCase(toggleSmtp.fulfilled, (state, action) => {
        state.toggleSmtp.isLoading = false;
        state.toggleSmtp.isSuccess = true;
        state.toggleSmtp.data = action.payload;
      })
      .addCase(toggleSmtp.rejected, (state, action) => {
        state.toggleSmtp.message = action.payload.message;
        state.toggleSmtp.isLoading = false;
        state.toggleSmtp.isError = true;
        state.toggleSmtp.data = null;
      });
  }
});
export default smtpSlice.reducer;
