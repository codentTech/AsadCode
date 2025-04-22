import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import offerCommentService from './offer-comments.service';

const initialState = {
  createOfferComment: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  getAllOfferComment: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  deleteOfferComment: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  updateOfferComment: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  }
};

export const createOfferComment = createAsyncThunk(
  '/offer-comment',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await offerCommentService.createOfferComment(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const getAllOfferComment = createAsyncThunk(
  '/offer-comment',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await offerCommentService.getAllOfferComment(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const deleteOfferComment = createAsyncThunk(
  '/offer-comment',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await offerCommentService.deleteOfferComment(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const updateOfferComment = createAsyncThunk(
  '/offer-comment',
  async ({ payload, id, callBackMessage }, thunkAPI) => {
    try {
      const response = await offerCommentService.updateOfferComment(payload, id);
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
