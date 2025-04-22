import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import taxRateService from './tax-rate.service';

const initialState = {
  createTaxRate: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  getAllTaxRate: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  getSingleTaxRate: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  deleteTaxRate: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  updateTaxRate: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  }
};

export const createTaxRate = createAsyncThunk(
  '/createTaxRate',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await taxRateService.createTaxRate(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const getAllTaxRate = createAsyncThunk(
  '/getAllTaxRate',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await taxRateService.getAllTaxRate(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const getSingleTaxRate = createAsyncThunk(
  '/getSingleTaxRate',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await taxRateService.getSingleTaxRate(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const deleteTaxRate = createAsyncThunk(
  '/deleteTaxRate',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await taxRateService.deleteTaxRate(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const updateTaxRate = createAsyncThunk(
  '/updateTaxRate',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await taxRateService.updateTaxRate(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const unitSlice = createSlice({
  name: 'unit',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createTaxRate.pending, (state) => {
        state.createTaxRate.isLoading = true;
        state.createTaxRate.message = '';
        state.createTaxRate.isError = false;
        state.createTaxRate.isSuccess = false;
        state.createTaxRate.data = null;
      })
      .addCase(createTaxRate.fulfilled, (state, action) => {
        state.createTaxRate.isLoading = false;
        state.createTaxRate.isSuccess = true;
        state.createTaxRate.data = action.payload;
      })
      .addCase(createTaxRate.rejected, (state, action) => {
        state.createTaxRate.message = action?.payload?.message;
        state.createTaxRate.isLoading = false;
        state.createTaxRate.isError = true;
        state.createTaxRate.data = null;
      })
      .addCase(getAllTaxRate.pending, (state) => {
        state.getAllTaxRate.isLoading = true;
        state.getAllTaxRate.message = '';
        state.getAllTaxRate.isError = false;
        state.getAllTaxRate.isSuccess = false;
        state.getAllTaxRate.data = null;
      })
      .addCase(getAllTaxRate.fulfilled, (state, action) => {
        state.getAllTaxRate.isLoading = false;
        state.getAllTaxRate.isSuccess = true;
        state.getAllTaxRate.data = action.payload;
      })
      .addCase(getAllTaxRate.rejected, (state, action) => {
        state.getAllTaxRate.message = action?.payload?.message;
        state.getAllTaxRate.isLoading = false;
        state.getAllTaxRate.isError = true;
        state.getAllTaxRate.data = null;
      })
      .addCase(getSingleTaxRate.pending, (state) => {
        state.getSingleTaxRate.isLoading = true;
        state.getSingleTaxRate.message = '';
        state.getSingleTaxRate.isError = false;
        state.getSingleTaxRate.isSuccess = false;
        state.getSingleTaxRate.data = null;
      })
      .addCase(getSingleTaxRate.fulfilled, (state, action) => {
        state.getSingleTaxRate.isLoading = false;
        state.getSingleTaxRate.isSuccess = true;
        state.getSingleTaxRate.data = action.payload;
      })
      .addCase(getSingleTaxRate.rejected, (state, action) => {
        state.getSingleTaxRate.message = action?.payload?.message;
        state.getSingleTaxRate.isLoading = false;
        state.getSingleTaxRate.isError = true;
        state.getSingleTaxRate.data = null;
      })
      .addCase(deleteTaxRate.pending, (state) => {
        state.deleteTaxRate.isLoading = true;
        state.deleteTaxRate.message = '';
        state.deleteTaxRate.isError = false;
        state.deleteTaxRate.isSuccess = false;
        state.deleteTaxRate.data = null;
      })
      .addCase(deleteTaxRate.fulfilled, (state, action) => {
        state.deleteTaxRate.isLoading = false;
        state.deleteTaxRate.isSuccess = true;
        state.deleteTaxRate.data = action.payload;
      })
      .addCase(deleteTaxRate.rejected, (state, action) => {
        state.deleteTaxRate.message = action?.payload?.message;
        state.deleteTaxRate.isLoading = false;
        state.deleteTaxRate.isError = true;
        state.deleteTaxRate.data = null;
      })
      .addCase(updateTaxRate.pending, (state) => {
        state.updateTaxRate.isLoading = true;
        state.updateTaxRate.message = '';
        state.updateTaxRate.isError = false;
        state.updateTaxRate.isSuccess = false;
        state.updateTaxRate.data = null;
      })
      .addCase(updateTaxRate.fulfilled, (state, action) => {
        state.updateTaxRate.isLoading = false;
        state.updateTaxRate.isSuccess = true;
        state.updateTaxRate.data = action.payload;
      })
      .addCase(updateTaxRate.rejected, (state, action) => {
        state.updateTaxRate.message = action?.payload?.message;
        state.updateTaxRate.isLoading = false;
        state.updateTaxRate.isError = true;
        state.updateTaxRate.data = null;
      });
  }
});

export default unitSlice.reducer;
