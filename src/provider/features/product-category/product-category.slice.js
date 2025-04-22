import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import productCategoryService from './product-category.service';

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

export const createProductCategory = createAsyncThunk(
  'productCategory/create',
  async ({ payload, successCallBack, callBackMessage }, thunkAPI) => {
    try {
      const response = await productCategoryService.createProductCategory(payload);
      if (response.Succeeded) {
        successCallBack(response.data);
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const getSingleProductCategory = createAsyncThunk(
  'productCategory/get',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await productCategoryService.getSingleProductCategory(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const getAllProductCategory = createAsyncThunk(
  'productCategory/getAll',
  async ({ payload, successCallBack = null, callBackMessage }, thunkAPI) => {
    try {
      const response = await productCategoryService.getAllProductCategory(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const updateProductCategory = createAsyncThunk(
  'productCategory/update',
  async ({ payload: { id, data }, successCallBack, callBackMessage }, thunkAPI) => {
    try {
      const response = await productCategoryService.updateProductCategory(id, data);
      if (response.Succeeded) {
        successCallBack(response.data);
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const deleteProductCategory = createAsyncThunk(
  'productCategory/delete',
  async ({ payload, successCallBack, callBackMessage }, thunkAPI) => {
    try {
      const response = await productCategoryService.deleteProductCategory(payload);
      if (response.Succeeded) {
        successCallBack(response.data);
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const productCategorySlice = createSlice({
  name: 'productCategory',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createProductCategory.pending, (state) => {
        state.create.isLoading = true;
        state.create.message = '';
        state.create.isError = false;
        state.create.isSuccess = false;
        state.create.data = null;
      })
      .addCase(createProductCategory.fulfilled, (state, action) => {
        state.create.isLoading = false;
        state.create.isSuccess = true;
        state.create.data = action.payload;
      })
      .addCase(createProductCategory.rejected, (state, action) => {
        state.create.message = action.payload.message;
        state.create.isLoading = false;
        state.create.isError = true;
        state.create.data = null;
      })
      .addCase(updateProductCategory.pending, (state) => {
        state.update.isLoading = true;
        state.update.message = '';
        state.update.isError = false;
        state.update.isSuccess = false;
        state.create.data = null;
      })
      .addCase(updateProductCategory.fulfilled, (state, action) => {
        state.update.isLoading = false;
        state.update.isSuccess = true;
        state.update.data = action.payload;
      })
      .addCase(updateProductCategory.rejected, (state, action) => {
        state.update.message = action.payload.message;
        state.update.isLoading = false;
        state.update.isError = true;
        state.update.data = null;
      })
      .addCase(getSingleProductCategory.pending, (state) => {
        state.getSingle.isLoading = true;
        state.getSingle.message = '';
        state.getSingle.isError = false;
        state.getSingle.isSuccess = false;
        state.getSingle.data = null;
      })
      .addCase(getSingleProductCategory.fulfilled, (state, action) => {
        state.getSingle.isLoading = false;
        state.getSingle.isSuccess = true;
        state.getSingle.data = action.payload;
      })
      .addCase(getSingleProductCategory.rejected, (state, action) => {
        state.getSingle.message = action.payload.message;
        state.getSingle.isLoading = false;
        state.getSingle.isError = true;
        state.getSingle.data = null;
      })
      .addCase(getAllProductCategory.pending, (state) => {
        state.getAll.isLoading = true;
        state.getAll.message = '';
        state.getAll.isError = false;
        state.getAll.isSuccess = false;
        state.getAll.data = null;
      })
      .addCase(getAllProductCategory.fulfilled, (state, action) => {
        state.getAll.isLoading = false;
        state.getAll.isSuccess = true;
        state.getAll.data = action.payload;
      })
      .addCase(getAllProductCategory.rejected, (state, action) => {
        state.getAll.message = action.payload.message;
        state.getAll.isLoading = false;
        state.getAll.isError = true;
        state.getAll.data = null;
      })
      .addCase(deleteProductCategory.pending, (state) => {
        state.delete.isLoading = true;
        state.delete.message = '';
        state.delete.isError = false;
        state.delete.isSuccess = false;
        state.delete.data = null;
      })
      .addCase(deleteProductCategory.fulfilled, (state, action) => {
        state.delete.isLoading = false;
        state.delete.isSuccess = true;
        state.delete.data = action.payload;
      })
      .addCase(deleteProductCategory.rejected, (state, action) => {
        state.delete.message = action.payload.message;
        state.delete.isLoading = false;
        state.delete.isError = true;
        state.delete.data = null;
      });
  }
});

export default productCategorySlice.reducer;
