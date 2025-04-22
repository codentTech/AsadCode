import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import discountGroupService from './discount-group.service';

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
  delete: { data: null, isError: false, isSuccess: false, isLoading: false, message: '' }
};

export const createDiscountGroup = createAsyncThunk(
  'discountGroup/create',
  async ({ payload }, thunkAPI) => {
    try {
      const response = await discountGroupService.createDiscountGroup(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const getSingleDiscountGroup = createAsyncThunk(
  'discountGroup/get',
  async ({ payload }, thunkAPI) => {
    try {
      const response = await discountGroupService.getSingleDiscountGroup(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const getAllDiscountGroup = createAsyncThunk(
  'discountGroup/getAll',
  async (payload, thunkAPI) => {
    try {
      const response = await discountGroupService.getAllDiscountGroup();
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const updateDiscountGroup = createAsyncThunk(
  'discountGroup/update',
  async ({ payload: { id, data }, callBackMessage }, thunkAPI) => {
    try {
      const response = await discountGroupService.updateDiscountGroup(id, data);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const deleteDiscountGroup = createAsyncThunk(
  'discountGroup/delete',
  async ({ payload }, thunkAPI) => {
    try {
      const response = await discountGroupService.deleteDiscountGroup(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const discountGroupSlice = createSlice({
  name: 'discountGroup',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createDiscountGroup.pending, (state) => {
        state.create.isLoading = true;
        state.create.message = '';
        state.create.isError = false;
        state.create.isSuccess = false;
        state.create.data = null;
      })
      .addCase(createDiscountGroup.fulfilled, (state, action) => {
        state.create.isLoading = false;
        state.create.isSuccess = true;
        state.create.data = action.payload;
      })
      .addCase(createDiscountGroup.rejected, (state, action) => {
        state.create.message = action.payload.message;
        state.create.isLoading = false;
        state.create.isError = true;
        state.create.data = null;
      })
      .addCase(updateDiscountGroup.pending, (state) => {
        state.update.isLoading = true;
        state.update.message = '';
        state.update.isError = false;
        state.update.isSuccess = false;
        state.update.data = null;
      })
      .addCase(updateDiscountGroup.fulfilled, (state, action) => {
        state.update.isLoading = false;
        state.update.isSuccess = true;
        state.update.data = action.payload;
      })
      .addCase(updateDiscountGroup.rejected, (state, action) => {
        state.update.message = action.payload.message;
        state.update.isLoading = false;
        state.update.isError = true;
        state.update.data = null;
      })
      .addCase(getSingleDiscountGroup.pending, (state) => {
        state.getSingle.isLoading = true;
        state.getSingle.message = '';
        state.getSingle.isError = false;
        state.getSingle.isSuccess = false;
        state.getSingle.data = null;
      })
      .addCase(getSingleDiscountGroup.fulfilled, (state, action) => {
        state.getSingle.isLoading = false;
        state.getSingle.isSuccess = true;
        state.getSingle.data = action.payload;
      })
      .addCase(getSingleDiscountGroup.rejected, (state, action) => {
        state.getSingle.message = action.payload.message;
        state.getSingle.isLoading = false;
        state.getSingle.isError = true;
        state.getSingle.data = null;
      })
      .addCase(getAllDiscountGroup.pending, (state) => {
        state.getAll.isLoading = true;
        state.getAll.message = '';
        state.getAll.isError = false;
        state.getAll.isSuccess = false;
        state.getAll.data = null;
      })
      .addCase(getAllDiscountGroup.fulfilled, (state, action) => {
        state.getAll.isLoading = false;
        state.getAll.isSuccess = true;
        state.getAll.data = action.payload;
      })
      .addCase(getAllDiscountGroup.rejected, (state, action) => {
        state.getAll.message = action.payload.message;
        state.getAll.isLoading = false;
        state.getAll.isError = true;
        state.getAll.data = null;
      })
      .addCase(deleteDiscountGroup.pending, (state) => {
        state.delete.isLoading = true;
        state.delete.message = '';
        state.delete.isError = false;
        state.delete.isSuccess = false;
        state.delete.data = null;
      })
      .addCase(deleteDiscountGroup.fulfilled, (state, action) => {
        state.delete.isLoading = false;
        state.delete.isSuccess = true;
        state.delete.data = action.payload;
      })
      .addCase(deleteDiscountGroup.rejected, (state, action) => {
        state.delete.message = action.payload.message;
        state.delete.isLoading = false;
        state.delete.isError = true;
        state.delete.data = null;
      });
  }
});

export default discountGroupSlice.reducer;
