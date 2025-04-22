import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import customerCommentService from './customer-comments.service';

const initialState = {
  createCustomerComment: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  getAllCustomerComment: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  deleteCustomerComment: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  updateCustomerComment: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  }
};

export const createCustomerComment = createAsyncThunk(
  'customerComment/createCustomerComment',
  async ({ payload }, thunkAPI) => {
    try {
      const response = await customerCommentService.createCustomerComment(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const getAllCustomerComment = createAsyncThunk(
  'customerComment/getAllCustomerComment',
  async ({ payload }, thunkAPI) => {
    try {
      const response = await customerCommentService.getAllCustomerComment(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const deleteCustomerComment = createAsyncThunk(
  'customerComment/deleteCustomerComment',
  async ({ payload }, thunkAPI) => {
    try {
      const response = await customerCommentService.deleteCustomerComment(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const updateCustomerComment = createAsyncThunk(
  'customerComment/updateCustomerComment',
  async ({ payload, id }, thunkAPI) => {
    try {
      const response = await customerCommentService.updateCustomerComment(payload, id);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const commentSlice = createSlice({
  name: 'customerComment',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createCustomerComment.pending, (state) => {
        state.createCustomerComment.isLoading = true;
        state.createCustomerComment.message = '';
        state.createCustomerComment.isError = false;
        state.createCustomerComment.isSuccess = false;
        state.createCustomerComment.data = null;
      })
      .addCase(createCustomerComment.fulfilled, (state, action) => {
        state.createCustomerComment.isLoading = false;
        state.createCustomerComment.isSuccess = true;
        state.createCustomerComment.data = action.payload;
      })
      .addCase(createCustomerComment.rejected, (state, action) => {
        state.createCustomerComment.message = action.payload.message;
        state.createCustomerComment.isLoading = false;
        state.createCustomerComment.isError = true;
        state.createCustomerComment.data = null;
      })
      .addCase(getAllCustomerComment.pending, (state) => {
        state.getAllCustomerComment.isLoading = true;
        state.getAllCustomerComment.message = '';
        state.getAllCustomerComment.isError = false;
        state.getAllCustomerComment.isSuccess = false;
        state.getAllCustomerComment.data = null;
      })
      .addCase(getAllCustomerComment.fulfilled, (state, action) => {
        state.getAllCustomerComment.isLoading = false;
        state.getAllCustomerComment.isSuccess = true;
        state.getAllCustomerComment.data = action.payload;
      })
      .addCase(getAllCustomerComment.rejected, (state, action) => {
        state.getAllCustomerComment.message = action.payload.message;
        state.getAllCustomerComment.isLoading = false;
        state.getAllCustomerComment.isError = true;
        state.getAllCustomerComment.data = null;
      })
      .addCase(deleteCustomerComment.pending, (state) => {
        state.deleteCustomerComment.isLoading = true;
        state.deleteCustomerComment.message = '';
        state.deleteCustomerComment.isError = false;
        state.deleteCustomerComment.isSuccess = false;
        state.deleteCustomerComment.data = null;
      })
      .addCase(deleteCustomerComment.fulfilled, (state, action) => {
        state.deleteCustomerComment.isLoading = false;
        state.deleteCustomerComment.isSuccess = true;
        state.deleteCustomerComment.data = action.payload;
      })
      .addCase(deleteCustomerComment.rejected, (state, action) => {
        state.deleteCustomerComment.message = action.payload.message;
        state.deleteCustomerComment.isLoading = false;
        state.deleteCustomerComment.isError = true;
        state.deleteCustomerComment.data = null;
      })
      .addCase(updateCustomerComment.pending, (state) => {
        state.updateCustomerComment.isLoading = true;
        state.updateCustomerComment.message = '';
        state.updateCustomerComment.isError = false;
        state.updateCustomerComment.isSuccess = false;
        state.updateCustomerComment.data = null;
      })
      .addCase(updateCustomerComment.fulfilled, (state, action) => {
        state.updateCustomerComment.isLoading = false;
        state.updateCustomerComment.isSuccess = true;
        state.updateCustomerComment.data = action.payload;
      })
      .addCase(updateCustomerComment.rejected, (state, action) => {
        state.updateCustomerComment.message = action.payload.message;
        state.updateCustomerComment.isLoading = false;
        state.updateCustomerComment.isError = true;
        state.updateCustomerComment.data = null;
      });
  }
});

export default commentSlice.reducer;
