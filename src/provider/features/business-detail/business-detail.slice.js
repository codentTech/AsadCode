import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import businessDetailService from './business-detail.service';

const initialState = {
  create: { data: null, isError: false, isSuccess: false, isLoading: false, message: '' },
  update: { data: null, isError: false, isSuccess: false, isLoading: false, message: '' },
  getSingle: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  getAll: { data: null, isError: false, isSuccess: false, isLoading: false, message: '' },
  delete: { data: null, isError: false, isSuccess: false, isLoading: false, message: '' },
  defaultTaxRateSet: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  }
};

export const createBusinessDetail = createAsyncThunk(
  'businessDetail/create',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await businessDetailService.createBusinessDetail(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const getSingleBusinessDetail = createAsyncThunk(
  'businessDetail/get',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await businessDetailService.getSingleBusinessDetail(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const getAllBusinessDetail = createAsyncThunk(
  'businessDetail/getAll',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await businessDetailService.getAllBusinessDetail();
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const updateBusinessDetail = createAsyncThunk(
  'businessDetail/update',
  async ({ payload: { id, data }, callBackMessage }, thunkAPI) => {
    try {
      const response = await businessDetailService.updateBusinessDetail(id, data);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const deleteBusinessDetail = createAsyncThunk(
  'businessDetail/delete',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await businessDetailService.deleteBusinessDetail(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const defaultTaxRateSet = createAsyncThunk(
  'businessDetail/default-tax-rate',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await businessDetailService.defaultTaxRateSet(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const businessDetailSlice = createSlice({
  name: 'businessDetail',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createBusinessDetail.pending, (state) => {
        state.create.isLoading = true;
        state.create.message = '';
        state.create.isError = false;
        state.create.isSuccess = false;
        state.create.data = null;
      })
      .addCase(createBusinessDetail.fulfilled, (state, action) => {
        state.create.isLoading = false;
        state.create.isSuccess = true;
        state.create.data = action.payload;
      })
      .addCase(createBusinessDetail.rejected, (state, action) => {
        state.create.message = action.payload.message;
        state.create.isLoading = false;
        state.create.isError = true;
        state.create.data = null;
      })
      .addCase(updateBusinessDetail.pending, (state) => {
        state.update.isLoading = true;
        state.update.message = '';
        state.update.isError = false;
        state.update.isSuccess = false;
        state.update.data = null;
      })
      .addCase(updateBusinessDetail.fulfilled, (state, action) => {
        state.update.isLoading = false;
        state.update.isSuccess = true;
        state.update.data = action.payload;
      })
      .addCase(updateBusinessDetail.rejected, (state, action) => {
        state.update.message = action.payload.message;
        state.update.isLoading = false;
        state.update.isError = true;
        state.update.data = null;
      })
      .addCase(getSingleBusinessDetail.pending, (state) => {
        state.getSingle.isLoading = true;
        state.getSingle.message = '';
        state.getSingle.isError = false;
        state.getSingle.isSuccess = false;
        state.getSingle.data = null;
      })
      .addCase(getSingleBusinessDetail.fulfilled, (state, action) => {
        state.getSingle.isLoading = false;
        state.getSingle.isSuccess = true;
        state.getSingle.data = action.payload;
      })
      .addCase(getSingleBusinessDetail.rejected, (state, action) => {
        state.getSingle.message = action.payload.message;
        state.getSingle.isLoading = false;
        state.getSingle.isError = true;
        state.getSingle.data = null;
      })
      .addCase(getAllBusinessDetail.pending, (state) => {
        state.getAll.isLoading = true;
        state.getAll.message = '';
        state.getAll.isError = false;
        state.getAll.isSuccess = false;
        state.getAll.data = null;
      })
      .addCase(getAllBusinessDetail.fulfilled, (state, action) => {
        state.getAll.isLoading = false;
        state.getAll.isSuccess = true;
        state.getAll.data = action.payload;
      })
      .addCase(getAllBusinessDetail.rejected, (state, action) => {
        state.getAll.message = action.payload.message;
        state.getAll.isLoading = false;
        state.getAll.isError = true;
        state.getAll.data = null;
      })
      .addCase(deleteBusinessDetail.pending, (state) => {
        state.delete.isLoading = true;
        state.delete.message = '';
        state.delete.isError = false;
        state.delete.isSuccess = false;
        state.delete.data = null;
      })
      .addCase(deleteBusinessDetail.fulfilled, (state, action) => {
        state.delete.isLoading = false;
        state.delete.isSuccess = true;
        state.delete.data = action.payload;
      })
      .addCase(deleteBusinessDetail.rejected, (state, action) => {
        state.delete.message = action.payload.message;
        state.delete.isLoading = false;
        state.delete.isError = true;
        state.delete.data = null;
      })
      .addCase(defaultTaxRateSet.pending, (state) => {
        state.defaultTaxRateSet.isLoading = true;
        state.defaultTaxRateSet.message = '';
        state.defaultTaxRateSet.isError = false;
        state.defaultTaxRateSet.isSuccess = false;
        state.defaultTaxRateSet.data = null;
      })
      .addCase(defaultTaxRateSet.fulfilled, (state, action) => {
        state.defaultTaxRateSet.isLoading = false;
        state.defaultTaxRateSet.isSuccess = true;
        state.defaultTaxRateSet.data = action.payload;
      })
      .addCase(defaultTaxRateSet.rejected, (state, action) => {
        state.defaultTaxRateSet.message = action.payload.message;
        state.defaultTaxRateSet.isLoading = false;
        state.defaultTaxRateSet.isError = true;
        state.defaultTaxRateSet.data = null;
      });
  }
});

export default businessDetailSlice.reducer;
