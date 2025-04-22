import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import uploadFileService from './upload-file.service';

const initialState = {
  uploadSingleFile: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  }
};

export const uploadSingleFile = createAsyncThunk(
  'uploadSingleFile',
  async ({ payload }, thunkAPI) => {
    try {
      const response = await uploadFileService.uploadSingleFile(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const uploadFileSlice = createSlice({
  name: 'uploadFile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadSingleFile.pending, (state) => {
        state.uploadSingleFile.isLoading = true;
        state.uploadSingleFile.message = '';
        state.uploadSingleFile.isError = false;
        state.uploadSingleFile.isSuccess = false;
        state.uploadSingleFile.data = null;
      })
      .addCase(uploadSingleFile.fulfilled, (state, action) => {
        state.uploadSingleFile.isLoading = false;
        state.uploadSingleFile.isSuccess = true;
        state.uploadSingleFile.data = action.payload;
      })
      .addCase(uploadSingleFile.rejected, (state, action) => {
        state.uploadSingleFile.message = action.payload.message;
        state.uploadSingleFile.isLoading = false;
        state.uploadSingleFile.isError = true;
        state.uploadSingleFile.data = null;
      });
  }
});

export default uploadFileSlice.reducer;
