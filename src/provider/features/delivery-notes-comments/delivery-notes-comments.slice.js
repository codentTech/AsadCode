import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import deliveryNotesCommentService from './delivery-notes-comments.service';

const initialState = {
  createDeliveryNotesComment: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  getAllDeliveryNotesComment: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  deleteDeliveryNotesComment: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  updateDeliveryNotesComment: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  }
};

export const createDeliveryNotesComment = createAsyncThunk(
  '/deliveryNotes-comment',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await deliveryNotesCommentService.createDeliveryNotesComment(
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

export const getAllDeliveryNotesComment = createAsyncThunk(
  '/deliveryNotes-comment',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await deliveryNotesCommentService.getAllDeliveryNotesComment(
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

export const deleteDeliveryNotesComment = createAsyncThunk(
  '/deliveryNotes-comment',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await deliveryNotesCommentService.deleteDeliveryNotesComment(
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

export const updateDeliveryNotesComment = createAsyncThunk(
  '/deliveryNotes-comment',
  async ({ payload, id, callBackMessage }, thunkAPI) => {
    try {
      const response = await deliveryNotesCommentService.updateDeliveryNotesComment(
        payload,
        id
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

export const commentSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {},
  extraReducers: (builder) => {}
});

export default commentSlice.reducer;
