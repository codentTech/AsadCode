import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import creditNoteCommentService from './credit-note-comments.service';

const initialState = {
  createCreditNoteComment: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  getAllCreditNoteComment: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  deleteCreditNoteComment: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  updateCreditNoteComment: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  }
};

export const createCreditNoteComment = createAsyncThunk(
  '/credit-note-comment',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await creditNoteCommentService.createCreditNoteComment(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const getAllCreditNoteComment = createAsyncThunk(
  '/credit-note-comment',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await creditNoteCommentService.getAllCreditNoteComment(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const deleteCreditNoteComment = createAsyncThunk(
  '/credit-note-comment',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await creditNoteCommentService.deleteCreditNoteComment(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const updateCreditNoteComment = createAsyncThunk(
  '/credit-note-comment',
  async ({ payload, id, callBackMessage }, thunkAPI) => {
    try {
      const response = await creditNoteCommentService.updateCreditNoteComment(
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
