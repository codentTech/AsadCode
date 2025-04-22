import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import orderCommentService from './order-comments.service';

const initialState = {
  createOrderComment: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  getAllOrderComment: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  deleteOrderComment: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  updateOrderComment: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  }
};

export const createOrderComment = createAsyncThunk(
  '/order-comment',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await orderCommentService.createOrderComment(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const getAllOrderComment = createAsyncThunk(
  '/order-comment',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await orderCommentService.getAllOrderComment(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const deleteOrderComment = createAsyncThunk(
  '/order-comment',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await orderCommentService.deleteOrderComment(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const updateOrderComment = createAsyncThunk(
  '/order-comment',
  async ({ payload, id, callBackMessage }, thunkAPI) => {
    try {
      const response = await orderCommentService.updateOrderComment(payload, id);
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
  name: 'orderComments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {}
});

export default commentSlice.reducer;
