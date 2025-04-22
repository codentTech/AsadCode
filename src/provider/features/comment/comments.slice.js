import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import commentService from './comments.service';

const initialState = {
  createComment: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  getAllComment: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  deleteComment: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  updateComment: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  }
};

export const createComment = createAsyncThunk(
  '/createComment',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await commentService.createInvoiceComment(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const getAllComment = createAsyncThunk(
  '/getAllComment',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await commentService.getAllInvoiceComment(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const deleteComment = createAsyncThunk(
  '/deleteComment',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await commentService.deleteInvoiceComment(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const updateComment = createAsyncThunk(
  '/updateComment',
  async ({ payload, id, callBackMessage }, thunkAPI) => {
    try {
      const response = await commentService.updateInvoiceComment(payload, id);
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
  name: 'comment',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createComment.pending, (state) => {
        state.createComment.isLoading = true;
        state.createComment.message = '';
        state.createComment.isError = false;
        state.createComment.isSuccess = false;
        state.createComment.data = null;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.createComment.isLoading = false;
        state.createComment.isSuccess = true;
        state.createComment.data = action.payload;
      })
      .addCase(createComment.rejected, (state, action) => {
        state.createComment.message = action.payload.message;
        state.createComment.isLoading = false;
        state.createComment.isError = true;
        state.createComment.data = null;
      })
      .addCase(getAllComment.pending, (state) => {
        state.getAllComment.isLoading = true;
        state.getAllComment.message = '';
        state.getAllComment.isError = false;
        state.getAllComment.isSuccess = false;
        state.getAllComment.data = null;
      })
      .addCase(getAllComment.fulfilled, (state, action) => {
        state.getAllComment.isLoading = false;
        state.getAllComment.isSuccess = true;
        state.getAllComment.data = action.payload;
      })
      .addCase(getAllComment.rejected, (state, action) => {
        state.getAllComment.message = action.payload.message;
        state.getAllComment.isLoading = false;
        state.getAllComment.isError = true;
        state.getAllComment.data = null;
      })
      .addCase(deleteComment.pending, (state) => {
        state.deleteComment.isLoading = true;
        state.deleteComment.message = '';
        state.deleteComment.isError = false;
        state.deleteComment.isSuccess = false;
        state.deleteComment.data = null;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.deleteComment.isLoading = false;
        state.deleteComment.isSuccess = true;
        state.deleteComment.data = action.payload;
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.deleteComment.message = action.payload.message;
        state.deleteComment.isLoading = false;
        state.deleteComment.isError = true;
        state.deleteComment.data = null;
      })
      .addCase(updateComment.pending, (state) => {
        state.updateComment.isLoading = true;
        state.updateComment.message = '';
        state.updateComment.isError = false;
        state.updateComment.isSuccess = false;
        state.updateComment.data = null;
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        state.updateComment.isLoading = false;
        state.updateComment.isSuccess = true;
        state.updateComment.data = action.payload;
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.updateComment.message = action.payload.message;
        state.updateComment.isLoading = false;
        state.updateComment.isError = true;
        state.updateComment.data = null;
      });
  }
});

export default commentSlice.reducer;
