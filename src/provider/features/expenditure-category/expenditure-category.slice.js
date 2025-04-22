import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import expenditureCategoryService from './expenditure-category.service';

const initialState = {
  createExpenditureCategory: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  getAllExpenditureCategory: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  deleteExpenditureCategory: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  updateExpenditureCategory: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  }
};

export const createExpenditureCategory = createAsyncThunk(
  'expenditure/createExpenditureCategory',
  async ({ payload }, thunkAPI) => {
    try {
      const response = await expenditureCategoryService.createExpenditureCategory(
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

export const getAllExpenditureCategory = createAsyncThunk(
  'expenditure/getAllExpenditureCategory',
  async ({ payload }, thunkAPI) => {
    try {
      const response = await expenditureCategoryService.getAllExpenditureCategory(
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

export const deleteExpenditureCategory = createAsyncThunk(
  'expenditure-category/deleteExpenditureCategory',
  async ({ payload }, thunkAPI) => {
    try {
      const response = await expenditureCategoryService.deleteExpenditureCategory(
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

export const updateExpenditureCategory = createAsyncThunk(
  'expenditure-category/update',
  async ({ payload: { id, data } }, thunkAPI) => {
    try {
      const response = await expenditureCategoryService.updateExpenditureCategory(
        id,
        data
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

export const expenditureCategorySlice = createSlice({
  name: 'expenditure',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createExpenditureCategory.pending, (state) => {
        state.createExpenditureCategory.isLoading = true;
        state.createExpenditureCategory.message = '';
        state.createExpenditureCategory.isError = false;
        state.createExpenditureCategory.isSuccess = false;
        state.createExpenditureCategory.data = null;
      })
      .addCase(createExpenditureCategory.fulfilled, (state, action) => {
        state.createExpenditureCategory.isLoading = false;
        state.createExpenditureCategory.isSuccess = true;
        state.createExpenditureCategory.data = action.payload;
      })
      .addCase(createExpenditureCategory.rejected, (state, action) => {
        state.createExpenditureCategory.message = action.payload.message;
        state.createExpenditureCategory.isLoading = false;
        state.createExpenditureCategory.isError = true;
        state.createExpenditureCategory.data = null;
      })
      .addCase(getAllExpenditureCategory.pending, (state) => {
        state.getAllExpenditureCategory.isLoading = true;
        state.getAllExpenditureCategory.message = '';
        state.getAllExpenditureCategory.isError = false;
        state.getAllExpenditureCategory.isSuccess = false;
        state.getAllExpenditureCategory.data = null;
      })
      .addCase(getAllExpenditureCategory.fulfilled, (state, action) => {
        state.getAllExpenditureCategory.isLoading = false;
        state.getAllExpenditureCategory.isSuccess = true;
        state.getAllExpenditureCategory.data = action.payload;
      })
      .addCase(getAllExpenditureCategory.rejected, (state, action) => {
        state.getAllExpenditureCategory.message = action.payload.message;
        state.getAllExpenditureCategory.isLoading = false;
        state.getAllExpenditureCategory.isError = true;
        state.getAllExpenditureCategory.data = null;
      })
      .addCase(deleteExpenditureCategory.pending, (state) => {
        state.deleteExpenditureCategory.isLoading = true;
        state.deleteExpenditureCategory.message = '';
        state.deleteExpenditureCategory.isError = false;
        state.deleteExpenditureCategory.isSuccess = false;
        state.deleteExpenditureCategory.data = null;
      })
      .addCase(deleteExpenditureCategory.fulfilled, (state, action) => {
        state.deleteExpenditureCategory.isLoading = false;
        state.deleteExpenditureCategory.isSuccess = true;
        state.deleteExpenditureCategory.data = action.payload;
      })
      .addCase(deleteExpenditureCategory.rejected, (state, action) => {
        state.deleteExpenditureCategory.message = action.payload.message;
        state.deleteExpenditureCategory.isLoading = false;
        state.deleteExpenditureCategory.isError = true;
        state.deleteExpenditureCategory.data = null;
      })
      .addCase(updateExpenditureCategory.pending, (state) => {
        state.updateExpenditureCategory.isLoading = true;
        state.updateExpenditureCategory.message = '';
        state.updateExpenditureCategory.isError = false;
        state.updateExpenditureCategory.isSuccess = false;
        state.updateExpenditureCategory.data = null;
      })
      .addCase(updateExpenditureCategory.fulfilled, (state, action) => {
        state.updateExpenditureCategory.isLoading = false;
        state.updateExpenditureCategory.isSuccess = true;
        state.updateExpenditureCategory.data = action.payload;
      })
      .addCase(updateExpenditureCategory.rejected, (state, action) => {
        state.updateExpenditureCategory.message = action.payload.message;
        state.updateExpenditureCategory.isLoading = false;
        state.updateExpenditureCategory.isError = true;
        state.updateExpenditureCategory.data = null;
      });
  }
});
export default expenditureCategorySlice.reducer;
