import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import scanQrCodeService from './qr-code-scan.service';

const initialState = {
  data: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: ''
};

export const scanQrCode = createAsyncThunk(
  '/open-api/delivery-notes/scan-qr-code',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await scanQrCodeService.scanQrCode(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const scanQrCodeSlice = createSlice({
  name: 'scanQrCode',
  initialState,
  reducers: {
    reset: (state) => {
      state = {
        data: null,
        isError: false,
        isSuccess: false,
        isLoading: false,
        message: ''
      };
    }
  },
  extraReducers: (builder) => {}
});

export const { reset } = scanQrCodeSlice.actions;

export default scanQrCodeSlice.reducer;
